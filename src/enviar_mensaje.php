<?php
declare(strict_types=1);

$recipient = 'secretaria@forestalgaruhape.com.ar';
$siteName = 'Forestal Garuhapé SA';
$redirectOk = '/?contacto=enviado#contacto';
$redirectError = '/?contacto=error#contacto';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: /#contacto', true, 303);
    exit;
}

if (!empty($_POST['website'] ?? '')) {
    header('Location: ' . $redirectOk, true, 303);
    exit;
}

$name = trim((string)($_POST['nombre'] ?? ''));
$email = trim((string)($_POST['email'] ?? ''));
$message = trim((string)($_POST['mensaje'] ?? ''));

if ($name === '' || $message === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    header('Location: ' . $redirectError, true, 303);
    exit;
}

$cleanName = str_replace(["\r", "\n"], ' ', $name);
$subject = 'Consulta desde la web de ' . $siteName;
$body = implode("\n", [
    'Nueva consulta recibida desde el formulario web.',
    '',
    'Nombre: ' . $cleanName,
    'Email: ' . $email,
    '',
    'Mensaje:',
    $message,
    '',
    'IP: ' . ($_SERVER['REMOTE_ADDR'] ?? 'desconocida'),
]);

$headers = [
    'From: ' . $siteName . ' <no-reply@forestalgaruhape.com.ar>',
    'Reply-To: ' . $cleanName . ' <' . $email . '>',
    'Content-Type: text/plain; charset=UTF-8',
    'X-Mailer: PHP/' . phpversion(),
];

$sent = @mail($recipient, $subject, $body, implode("\r\n", $headers));

header('Location: ' . ($sent ? $redirectOk : $redirectError), true, 303);
exit;
