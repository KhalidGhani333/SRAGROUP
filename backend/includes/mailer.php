<?php
declare(strict_types=1);

/**
 * Sends a plain-text email. Uses SMTP when mail.smtp.host is set (a cPanel mailbox, Gmail…),
 * otherwise PHP mail(). Never throws: a failed email must not lose a lead.
 */
function send_mail(string|array $to, string $subject, string $body, ?string $replyTo = null, bool $force = false): bool
{
    $GLOBALS['__mail_error'] = null;
    if (!$force && !config('mail.enabled')) {
        return mail_fail('Email is disabled (mail.enabled = false in config.php).');
    }
    $recipients = array_values(array_filter((array) $to, fn ($a) => filter_var($a, FILTER_VALIDATE_EMAIL)));
    if (!$recipients) {
        return mail_fail('No valid recipient.');
    }

    $from = (string) config('mail.from');
    $fromName = mb_encode_mimeheader((string) config('mail.from_name', 'SRAGROUP'), 'UTF-8');
    $headers = [
        'From' => $fromName . ' <' . $from . '>',
        'MIME-Version' => '1.0',
        'Content-Type' => 'text/plain; charset=UTF-8',
        'Content-Transfer-Encoding' => 'base64',
    ];
    if ($replyTo && filter_var($replyTo, FILTER_VALIDATE_EMAIL)) {
        $headers['Reply-To'] = $replyTo;
    }
    $encodedSubject = mb_encode_mimeheader($subject, 'UTF-8');
    $encodedBody = rtrim(chunk_split(base64_encode($body), 76, "\r\n"));

    try {
        if (config('mail.smtp.host')) {
            smtp_send($from, $recipients, $encodedSubject, $encodedBody, $headers);
            return true;
        }
        $lines = [];
        foreach ($headers as $k => $v) {
            $lines[] = "{$k}: {$v}";
        }
        if (!@mail(implode(', ', $recipients), $encodedSubject, $encodedBody, implode("\r\n", $lines))) {
            return mail_fail('PHP mail() failed. On XAMPP configure SMTP in config.php (mail.smtp).');
        }
        return true;
    } catch (Throwable $e) {
        return mail_fail($e->getMessage());
    }
}

function mail_fail(string $message): bool
{
    $GLOBALS['__mail_error'] = $message;
    error_log('[sragroup-crm] email: ' . $message);
    return false;
}

function last_mail_error(): ?string
{
    return $GLOBALS['__mail_error'] ?? null;
}

/** Minimal SMTP client: SSL (465) or STARTTLS (587), AUTH LOGIN. */
function smtp_send(string $from, array $recipients, string $subject, string $body, array $headers): void
{
    $host = (string) config('mail.smtp.host');
    $port = (int) config('mail.smtp.port', 587);
    $encryption = (string) config('mail.smtp.encryption', 'tls');

    $socket = @stream_socket_client(
        ($encryption === 'ssl' ? 'ssl://' : 'tcp://') . $host . ':' . $port,
        $errno,
        $errstr,
        15,
    );
    if (!$socket) {
        throw new RuntimeException("Cannot connect to SMTP {$host}:{$port} ({$errstr})");
    }
    stream_set_timeout($socket, 15);

    $read = function () use ($socket): string {
        $response = '';
        while (($line = fgets($socket, 515)) !== false) {
            $response .= $line;
            if (strlen($line) < 4 || $line[3] === ' ') {
                break;
            }
        }
        return $response;
    };
    $cmd = function (string $command, array $expect, ?string $display = null) use ($socket, $read): string {
        fwrite($socket, $command . "\r\n");
        $response = $read();
        if (!in_array((int) substr($response, 0, 3), $expect, true)) {
            throw new RuntimeException('SMTP error after ' . ($display ?? strtok($command, ' ')) . ': ' . trim($response));
        }
        return $response;
    };

    try {
        $greeting = $read();
        if ((int) substr($greeting, 0, 3) !== 220) {
            throw new RuntimeException('SMTP server did not greet: ' . trim($greeting));
        }
        $self = gethostname() ?: 'localhost';
        $cmd("EHLO {$self}", [250]);
        if ($encryption === 'tls') {
            $cmd('STARTTLS', [220]);
            if (!stream_socket_enable_crypto($socket, true, STREAM_CRYPTO_METHOD_TLS_CLIENT)) {
                throw new RuntimeException('STARTTLS negotiation failed.');
            }
            $cmd("EHLO {$self}", [250]);
        }
        if (config('mail.smtp.user')) {
            $cmd('AUTH LOGIN', [334]);
            $cmd(base64_encode((string) config('mail.smtp.user')), [334], 'username');
            $cmd(base64_encode((string) config('mail.smtp.pass')), [235], 'password');
        }
        $cmd("MAIL FROM:<{$from}>", [250]);
        foreach ($recipients as $rcpt) {
            $cmd("RCPT TO:<{$rcpt}>", [250, 251]);
        }
        $cmd('DATA', [354]);

        $lines = [
            'Date: ' . date('r'),
            'To: ' . implode(', ', $recipients),
            'Subject: ' . $subject,
            'Message-ID: <' . bin2hex(random_bytes(12)) . '@' . (explode('@', $from)[1] ?? 'localhost') . '>',
        ];
        foreach ($headers as $k => $v) {
            $lines[] = "{$k}: {$v}";
        }
        $cmd(implode("\r\n", $lines) . "\r\n\r\n" . $body . "\r\n.", [250], 'message');
        $cmd('QUIT', [221]);
    } finally {
        fclose($socket);
    }
}
