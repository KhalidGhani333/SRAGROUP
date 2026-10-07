<?php
declare(strict_types=1);

/*
 * Admin panel languages. English strings are the keys; ADMIN_IT holds the Italian text.
 * Each user picks a language in "My profile"; sign-in pages follow the last choice or the browser.
 */

const ADMIN_LANGS = ['it' => 'Italiano', 'en' => 'English'];

function lang(): string
{
    return $GLOBALS['__lang'] ?? 'it';
}

function set_lang(string $lang): void
{
    $GLOBALS['__lang'] = isset(ADMIN_LANGS[$lang]) ? $lang : 'it';
}

/** Language before sign-in: ?lang= switch, then the remembered cookie, then the browser. */
function detect_guest_lang(): string
{
    $requested = $_GET['lang'] ?? null;
    if (is_string($requested) && isset(ADMIN_LANGS[$requested])) {
        remember_lang($requested);
        return $requested;
    }
    $cookie = $_COOKIE['crm_lang'] ?? null;
    if (is_string($cookie) && isset(ADMIN_LANGS[$cookie])) {
        return $cookie;
    }
    $browser = strtolower(substr((string) ($_SERVER['HTTP_ACCEPT_LANGUAGE'] ?? ''), 0, 2));
    return $browser === 'en' ? 'en' : 'it';
}

function remember_lang(string $lang): void
{
    if (!headers_sent()) {
        setcookie('crm_lang', $lang, ['expires' => time() + 31536000, 'path' => '/', 'samesite' => 'Lax', 'httponly' => true]);
    }
}

/** Translates an English UI string; extra arguments are passed to sprintf. */
function __(string $text, mixed ...$args): string
{
    $out = lang() === 'it' ? (ADMIN_IT[$text] ?? $text) : $text;
    return $args ? sprintf($out, ...$args) : $out;
}

/** Singular/plural variant: __n('%d lead', '%d leads', $n). */
function __n(string $singular, string $plural, int $n): string
{
    return __($n === 1 ? $singular : $plural, $n);
}

/** date() with Italian day and month names when the panel is in Italian. */
function local_date(string $format, int $timestamp): string
{
    $out = date($format, $timestamp);
    if (lang() !== 'it') {
        return $out;
    }
    $months = ['January' => 'gennaio', 'February' => 'febbraio', 'March' => 'marzo', 'April' => 'aprile', 'May' => 'maggio', 'June' => 'giugno', 'July' => 'luglio', 'August' => 'agosto', 'September' => 'settembre', 'October' => 'ottobre', 'November' => 'novembre', 'December' => 'dicembre'];
    $short = ['Jan' => 'gen', 'Feb' => 'feb', 'Mar' => 'mar', 'Apr' => 'apr', 'May' => 'mag', 'Jun' => 'giu', 'Jul' => 'lug', 'Aug' => 'ago', 'Sep' => 'set', 'Oct' => 'ott', 'Nov' => 'nov', 'Dec' => 'dic'];
    $days = ['Monday' => 'lunedì', 'Tuesday' => 'martedì', 'Wednesday' => 'mercoledì', 'Thursday' => 'giovedì', 'Friday' => 'venerdì', 'Saturday' => 'sabato', 'Sunday' => 'domenica'];
    $map = [];
    if (str_contains($format, 'F')) {
        $map += $months;
    }
    if (str_contains($format, 'M')) {
        $map += $short;
    }
    if (str_contains($format, 'l')) {
        $map += $days;
    }
    return strtr($out, $map);
}

const ADMIN_IT = [
    // Navigation & layout
    'Dashboard' => 'Dashboard',
    'Leads' => 'Richieste',
    'Users' => 'Utenti',
    'My profile' => 'Il mio profilo',
    'Sign out' => 'Esci',
    'Open menu' => 'Apri menu',
    'Dismiss' => 'Chiudi',
    'Pagination' => 'Paginazione',
    'Previous' => 'Precedente',
    'Next' => 'Successiva',
    'Page %d of %d' => 'Pagina %d di %d',
    'Language' => 'Lingua',

    // Vocabulary (constants in crm.php)
    'Construction' => 'Costruzioni',
    'Solar' => 'Fotovoltaico',
    'General' => 'Generale',
    'New' => 'Nuova',
    'Contacted' => 'Contattato',
    'Qualified' => 'Qualificata',
    'Quote sent' => 'Preventivo inviato',
    'Won' => 'Vinta',
    'Lost' => 'Persa',
    'Low' => 'Bassa',
    'Normal' => 'Normale',
    'High' => 'Alta',
    'Administrator' => 'Amministratore',
    'Team member' => 'Membro del team',
    'All divisions' => 'Tutte le divisioni',
    'General only' => 'Solo Generale',
    'Construction only' => 'Solo Costruzioni',
    'Solar only' => 'Solo Fotovoltaico',
    'Project type' => 'Tipo di progetto',
    'Industrial' => 'Industriale',
    'Commercial' => 'Commerciale',
    'Residential' => 'Residenziale',
    'Area (m²)' => 'Superficie (m²)',
    'Location' => 'Località',
    'Timeline' => 'Tempistiche',
    'Installation type' => 'Tipo di impianto',
    'Rooftop' => 'Su tetto',
    'Ground-mounted' => 'A terra',
    'Solar park' => 'Parco solare',
    'Power (kWp)' => 'Potenza (kWp)',
    'Annual energy bill (€)' => 'Bolletta energetica annua (€)',
    'Subject' => 'Oggetto',
    'As soon as possible' => 'Il prima possibile',
    '3–6 months' => '3–6 mesi',
    '6–12 months' => '6–12 mesi',
    'Over 12 months' => 'Oltre 12 mesi',
    'Not defined yet' => 'Non ancora definite',
    '%s/yr bill' => '%s/anno di bolletta',

    // Time
    'just now' => 'adesso',
    '%d minute ago' => '%d minuto fa',
    '%d minutes ago' => '%d minuti fa',
    '%d hour ago' => '%d ora fa',
    '%d hours ago' => '%d ore fa',
    '%d day ago' => '%d giorno fa',
    '%d days ago' => '%d giorni fa',
    '%d week ago' => '%d settimana fa',
    '%d weeks ago' => '%d settimane fa',
    '%d month ago' => '%d mese fa',
    '%d months ago' => '%d mesi fa',
    'Today' => 'Oggi',
    'Never' => 'Mai',
    'never' => 'mai',

    // Auth & setup
    'Sign in' => 'Accedi',
    'SRAGROUP CRM' => 'SRAGROUP CRM',
    'Use the account your administrator created for you.' => 'Usa l’account che ti ha creato l’amministratore.',
    'Email' => 'Email',
    'Password' => 'Password',
    'Forgot your password? Ask an administrator to reset it from the Users page.' => 'Password dimenticata? Chiedi a un amministratore di reimpostarla dalla pagina Utenti.',
    'Email or password is not correct.' => 'Email o password non corretti.',
    'Too many failed attempts. Please wait %d minutes and try again.' => 'Troppi tentativi falliti. Attendi %d minuti e riprova.',
    'Your session expired. Go back, reload the page and try again.' => 'La sessione è scaduta. Torna indietro, ricarica la pagina e riprova.',
    'Only administrators can open that page.' => 'Solo gli amministratori possono aprire quella pagina.',
    'SRAGROUP · Lead management' => 'SRAGROUP · Gestione richieste',
    'Every construction and solar request, in one place.' => 'Tutte le richieste di costruzioni e fotovoltaico, in un unico posto.',
    'Construction division' => 'Divisione Costruzioni',
    'Solar &amp; renewable energy' => 'Fotovoltaico &amp; rinnovabili',
    'General enquiries' => 'Richieste generali',
    'Setup' => 'Configurazione',
    'First-time setup' => 'Prima configurazione',
    'Create the administrator' => 'Crea l’amministratore',
    'The database tables are ready. Create the first admin account; you can add the rest of the team afterwards.' => 'Le tabelle del database sono pronte. Crea il primo account amministratore; potrai aggiungere il resto del team in seguito.',
    'Full name' => 'Nome e cognome',
    'Confirm password' => 'Conferma password',
    'Create admin &amp; open CRM' => 'Crea amministratore e apri il CRM',
    'Try again' => 'Riprova',
    'Enter your name.' => 'Inserisci il tuo nome.',
    'Enter a name.' => 'Inserisci un nome.',
    'Enter a valid email address.' => 'Inserisci un indirizzo email valido.',
    'Passwords do not match.' => 'Le password non coincidono.',
    'Password must be at least 10 characters.' => 'La password deve avere almeno 10 caratteri.',
    'Password must contain letters and numbers.' => 'La password deve contenere lettere e numeri.',
    'At least 10 characters, with letters and numbers.' => 'Almeno 10 caratteri, con lettere e numeri.',
    'Welcome! Your CRM is ready. New quote requests from the website will appear under Leads.' => 'Benvenuto! Il CRM è pronto. Le nuove richieste di preventivo dal sito compariranno in Richieste.',

    // Dashboard
    'Good morning' => 'Buongiorno',
    'Good afternoon' => 'Buon pomeriggio',
    'Good evening' => 'Buonasera',
    '%d new request waiting for an owner' => '%d nuova richiesta in attesa di un responsabile',
    '%d new requests waiting for an owner' => '%d nuove richieste in attesa di un responsabile',
    '%d open lead assigned to you' => '%d richiesta aperta assegnata a te',
    '%d open leads assigned to you' => '%d richieste aperte assegnate a te',
    'Export CSV' => 'Esporta CSV',
    'All leads' => 'Tutte le richieste',
    'New requests' => 'Nuove richieste',
    'Need a first contact' => 'Da contattare',
    'Open pipeline' => 'Pipeline aperta',
    '%s estimated' => '%s stimati',
    'This month' => 'Questo mese',
    'vs last month' => 'rispetto al mese scorso',
    '%d last month' => '%d il mese scorso',
    'Win rate' => 'Tasso di successo',
    '%d won' => '%d vinte',
    'Requests · last 30 days' => 'Richieste · ultimi 30 giorni',
    'Requests per day over the last 30 days' => 'Richieste al giorno negli ultimi 30 giorni',
    '%d total' => '%d in totale',
    'By division' => 'Per divisione',
    '%d all time' => '%d in totale',
    'Pipeline' => 'Pipeline',
    'Latest requests' => 'Ultime richieste',
    'View all' => 'Vedi tutte',
    'No requests yet' => 'Ancora nessuna richiesta',
    'Quote requests sent from the website contact form will appear here automatically.' => 'Le richieste di preventivo inviate dal modulo del sito compariranno qui automaticamente.',
    'Follow-ups' => 'Ricontatti',
    'Overdue' => 'In ritardo',
    'Overdue · %s' => 'In ritardo · %s',
    'No follow-ups planned for the next 7 days.' => 'Nessun ricontatto pianificato nei prossimi 7 giorni.',

    // Leads list
    'CRM' => 'CRM',
    '%d request' => '%d richiesta',
    '%d requests' => '%d richieste',
    ' match your filters' => ' corrispondono ai filtri',
    'Status' => 'Stato',
    'All' => 'Tutte',
    'Open' => 'Aperte',
    'Search name, company, email, phone or reference' => 'Cerca nome, azienda, email, telefono o riferimento',
    'Division' => 'Divisione',
    'Owner' => 'Responsabile',
    'Any owner' => 'Qualsiasi responsabile',
    'Assigned to me' => 'Assegnate a me',
    'Unassigned' => 'Non assegnata',
    'Priority' => 'Priorità',
    'Any priority' => 'Qualsiasi priorità',
    'From' => 'Dal',
    'To' => 'Al',
    'Apply' => 'Applica',
    'Clear' => 'Azzera',
    'Showing open leads with a follow-up due today or earlier.' => 'Richieste aperte con ricontatto previsto per oggi o prima.',
    'Remove' => 'Rimuovi',
    'No leads match these filters' => 'Nessuna richiesta corrisponde ai filtri',
    'Try another status or clear the filters.' => 'Prova un altro stato o azzera i filtri.',
    'Requests from the website contact form will appear here.' => 'Le richieste dal modulo contatti del sito compariranno qui.',
    'Contact' => 'Contatto',
    'Request' => 'Richiesta',
    'Received' => 'Ricevuta',
    'Has attachment' => 'Con allegato',
    'Not assigned' => 'Non assegnata',

    // Lead detail
    'That lead does not exist or belongs to another division.' => 'La richiesta non esiste o appartiene a un’altra divisione.',
    'Status changed from %s to %s' => 'Stato cambiato da %s a %s',
    'Priority set to %s' => 'Priorità impostata su %s',
    'Assigned to %s' => 'Assegnata a %s',
    'Owner removed' => 'Responsabile rimosso',
    'Estimated value must be a number.' => 'Il valore stimato deve essere un numero.',
    'Estimated value removed' => 'Valore stimato rimosso',
    'Estimated value set to %s' => 'Valore stimato impostato a %s',
    'Follow-up planned for %s' => 'Ricontatto pianificato per il %s',
    'Follow-up removed' => 'Ricontatto rimosso',
    'Lead updated.' => 'Richiesta aggiornata.',
    'Nothing changed.' => 'Nessuna modifica.',
    'Write something before adding the note.' => 'Scrivi qualcosa prima di aggiungere la nota.',
    'Added a note' => 'Ha aggiunto una nota',
    'Note added.' => 'Nota aggiunta.',
    'Note deleted.' => 'Nota eliminata.',
    'Lead %s and all its data were permanently deleted.' => 'La richiesta %s e tutti i suoi dati sono stati eliminati definitivamente.',
    'Request received from the website (%s)' => 'Richiesta ricevuta dal sito web (%s)',
    'All leads' => 'Tutte le richieste',
    '%s · Received %s' => '%s · Ricevuta il %s',
    '%s at ' => '%s presso ',
    'Call' => 'Chiama',
    'WhatsApp' => 'WhatsApp',
    'Pipeline stage' => 'Fase della pipeline',
    'Message' => 'Messaggio',
    'Notes' => 'Note',
    'Call summary, next steps, quote details…' => 'Esito della chiamata, prossimi passi, dettagli del preventivo…',
    'Mark as contacted' => 'Segna come contattato',
    'Add note' => 'Aggiungi nota',
    'Deleted user' => 'Utente eliminato',
    'Delete this note?' => 'Eliminare questa nota?',
    'Delete note' => 'Elimina nota',
    'Activity' => 'Attività',
    'Website' => 'Sito web',
    'System' => 'Sistema',
    'Manage' => 'Gestione',
    'Internal fields for your team - the customer doesn\'t fill these. Pick an owner, set the deal value once you quote, and plan the next call.' => 'Campi interni per il team: il cliente non li compila. Scegli un responsabile, inserisci il valore quando invii il preventivo e pianifica il prossimo contatto.',
    '(me)' => '(io)',
    'Estimated value (€)' => 'Valore stimato (€)',
    'e.g. 250000' => 'es. 250000',
    'Next follow-up' => 'Prossimo ricontatto',
    'Save changes' => 'Salva modifiche',
    'Consent &amp; source' => 'Consenso e provenienza',
    'Privacy policy' => 'Privacy policy',
    'Accepted' => 'Accettata',
    'No' => 'No',
    'Yes' => 'Sì',
    'Marketing' => 'Marketing',
    'Opted in' => 'Consenso dato',
    'Not given' => 'Non dato',
    'English' => 'Inglese',
    'Italian' => 'Italiano',
    'Submitted' => 'Inviata',
    'Page' => 'Pagina',
    'IP address' => 'Indirizzo IP',
    'Other requests from this contact' => 'Altre richieste di questo contatto',
    'Delete lead' => 'Elimina richiesta',
    'Permanently removes the request, its attachment, notes and history - use it for GDPR erasure requests.' => 'Rimuove definitivamente la richiesta, l’allegato, le note e lo storico: da usare per le richieste di cancellazione GDPR.',
    'Permanently delete %s? This cannot be undone.' => 'Eliminare definitivamente %s? L’operazione non può essere annullata.',
    'Delete permanently' => 'Elimina definitivamente',
    'File not found.' => 'File non trovato.',

    // Users
    'Administration' => 'Amministrazione',
    'Administrators see everything and manage users. Team members only see the leads of their division.' => 'Gli amministratori vedono tutto e gestiscono gli utenti. I membri del team vedono solo le richieste della propria divisione.',
    'User' => 'Utente',
    'Role' => 'Ruolo',
    'Sees' => 'Vede',
    'Open leads' => 'Richieste aperte',
    'Last sign-in' => 'Ultimo accesso',
    'You' => 'Tu',
    'Disabled' => 'Disattivato',
    'Admin' => 'Admin',
    'Edit' => 'Modifica',
    'Add a user' => 'Aggiungi utente',
    'Leads visible' => 'Richieste visibili',
    'E.g. the solar team only sees solar requests.' => 'Es. il team fotovoltaico vede solo le richieste fotovoltaico.',
    'Temporary password' => 'Password temporanea',
    'Generate one' => 'Generane una',
    'Create user' => 'Crea utente',
    'A user with this email already exists.' => 'Esiste già un utente con questa email.',
    'Choose a role.' => 'Scegli un ruolo.',
    'Choose which leads this user sees.' => 'Scegli quali richieste vede questo utente.',
    '%s can now sign in with %s. Share the password with them privately.' => '%s ora può accedere con %s. Comunica la password in modo riservato.',
    'User not found.' => 'Utente non trovato.',
    'Another user already uses this email.' => 'Un altro utente usa già questa email.',
    'Choose a valid role and division.' => 'Scegli un ruolo e una divisione validi.',
    'You cannot remove your own admin access or disable yourself.' => 'Non puoi rimuovere il tuo accesso da amministratore o disattivarti.',
    'This is the last active administrator. Promote someone else first.' => 'È l’ultimo amministratore attivo. Promuovi prima un altro utente.',
    'User saved.' => 'Utente salvato.',
    'Password changed. Share the new password with %s privately.' => 'Password cambiata. Comunica la nuova password a %s in modo riservato.',
    '%s was deleted. Their leads are now unassigned; notes stay as "Deleted user".' => '%s è stato eliminato. Le sue richieste ora non sono assegnate; le note restano come "Utente eliminato".',
    'All users' => 'Tutti gli utenti',
    '%s · Last sign-in %s' => '%s · Ultimo accesso: %s',
    'Details &amp; access' => 'Dati e accesso',
    'Account enabled (can sign in)' => 'Account attivo (può accedere)',
    'Save user' => 'Salva utente',
    'Reset password' => 'Reimposta password',
    'New password' => 'Nuova password',
    'Set new password' => 'Imposta nuova password',
    'Delete user' => 'Elimina utente',
    'Prefer disabling the account to keep their name on notes. Deleting unassigns their %d open leads.' => 'Meglio disattivare l’account per mantenere il nome sulle note. L’eliminazione rimuove l’assegnazione di %d richieste aperte.',
    'Delete %s? This cannot be undone.' => 'Eliminare %s? L’operazione non può essere annullata.',

    // Profile & email
    'Your details' => 'I tuoi dati',
    'Only an administrator can change the sign-in email.' => 'Solo un amministratore può cambiare l’email di accesso.',
    'Panel language' => 'Lingua del pannello',
    'Save' => 'Salva',
    'Profile updated.' => 'Profilo aggiornato.',
    'Change password' => 'Cambia password',
    'Current password' => 'Password attuale',
    'Confirm new password' => 'Conferma nuova password',
    'Update password' => 'Aggiorna password',
    'Your current password is not correct.' => 'La password attuale non è corretta.',
    'Password changed.' => 'Password cambiata.',
    'Email notifications' => 'Notifiche email',
    'Sending' => 'Invio',
    'Disabled in config.php (mail.enabled)' => 'Disattivate in config.php (mail.enabled)',
    'SMTP · %s' => 'SMTP · %s',
    'PHP mail() of the server' => 'PHP mail() del server',
    'Sender' => 'Mittente',
    'Auto-reply to customer' => 'Risposta automatica al cliente',
    'On' => 'Attiva',
    'Off' => 'Disattiva',
    'Send a test email to %s to check the settings.' => 'Invia un’email di prova a %s per verificare le impostazioni.',
    'Send test email' => 'Invia email di prova',
    'Test email sent to %s. Check the inbox (and spam folder).' => 'Email di prova inviata a %s. Controlla la posta in arrivo (e lo spam).',
    'Test email failed: %s' => 'Invio di prova non riuscito: %s',
    'SRAGROUP CRM — test email' => 'SRAGROUP CRM — email di prova',
    'This is a test email from the SRAGROUP CRM. If you can read it, notifications are working.' => 'Questa è un’email di prova dal CRM SRAGROUP. Se la leggi, le notifiche funzionano.',

    // Notification emails (sent in the panel's default language, Italian)
    'New quote request %s' => 'Nuova richiesta di preventivo %s',
    'Name' => 'Nome',
    'Company' => 'Azienda',
    'Phone' => 'Telefono',
    'Open in CRM' => 'Apri nel CRM',
    '[%s] New request %s — %s' => '[%s] Nuova richiesta %s — %s',

    // CSV export
    'Reference' => 'Riferimento',
    'First name' => 'Nome',
    'Last name' => 'Cognome',
    'Estimated value (EUR)' => 'Valore stimato (EUR)',
    'Follow-up' => 'Ricontatto',
    'Attachment' => 'Allegato',
    'Marketing consent' => 'Consenso marketing',
];
