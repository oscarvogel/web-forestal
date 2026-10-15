<?php
declare(strict_types=1);

$recipient = 'secretaria@forestalgaruhape.com.ar';
$siteName = 'Forestal Garuhapé SA';
$serviceLabels = [
    'cosecha-forestal' => 'Cosecha forestal',
    'transporte-forestal' => 'Transporte forestal',
    'playas-de-acopio' => 'Playas de acopio en industria',
    'caminos-forestales' => 'Caminos forestales',
    'aprovechamiento-biomasa-forestal' => 'Aprovechamiento de biomasa forestal',
    'consultoria-forestal' => 'Consultoría forestal',
];
$isJson = str_contains(strtolower((string)($_SERVER['HTTP_ACCEPT'] ?? '')), 'application/json');

function escapeHtml(string $value): string
{
    return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function respondJson(int $status, array $payload): never
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    header('X-Content-Type-Options: nosniff');
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR);
    exit;
}

function renderContactResponse(string $title, string $message, bool $isError, array $values = [], array $fieldErrors = []): never
{
    global $serviceLabels;
    $selectedService = (string)($values['servicio'] ?? '');
    $cssFiles = glob(__DIR__ . '/assets/site-*.css') ?: [];
    $cssHref = $cssFiles === [] ? '' : '/assets/' . basename($cssFiles[0]);
    $name = escapeHtml((string)($values['nombre'] ?? ''));
    $email = escapeHtml((string)($values['email'] ?? ''));
    $body = escapeHtml((string)($values['mensaje'] ?? ''));
    $hasResponseForm = array_key_exists('nombre', $values) || array_key_exists('email', $values) || array_key_exists('mensaje', $values);
    $statusRole = $isError ? 'alert' : 'status';
    $buttonLabel = $hasResponseForm ? 'Volver al formulario' : 'Volver al inicio';
    $buttonTarget = $hasResponseForm ? '#response-form' : '/';

    header('Content-Type: text/html; charset=utf-8');
    header('Cache-Control: no-store');
    header('X-Content-Type-Options: nosniff');
    ?>
    <!doctype html>
    <html lang="es-AR">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title><?= escapeHtml($title) ?> | Forestal Garuhapé SA</title>
        <?php if ($cssHref !== ''): ?><link rel="stylesheet" href="<?= escapeHtml($cssHref) ?>"><?php endif; ?>
      </head>
      <body>
        <a class="skip-link" href="#response-content">Saltar al contenido</a>
        <header class="site-header">
          <div class="site-container header-inner">
            <a class="site-brand" href="/" aria-label="Forestal Garuhapé SA, inicio">
              <img src="/images/fg-negative.svg" alt="Forestal Garuhapé SA" width="215" height="116">
            </a>
          </div>
        </header>
        <main class="contact-section response-section" id="response-content">
          <div class="site-container response-copy">
            <p class="eyebrow eyebrow--light">Contacto comercial</p>
            <h1><?= escapeHtml($title) ?></h1>
            <p role="<?= escapeHtml($statusRole) ?>" aria-live="<?= $isError ? 'assertive' : 'polite' ?>"><?= escapeHtml($message) ?></p>
            <?php if ($hasResponseForm): ?>
              <form class="contact-form response-form" id="response-form" action="/enviar_mensaje.php" method="post">
                <input type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true" class="field-trap">
                <div class="form-field">
                  <label for="response-nombre">Nombre</label>
                  <input id="response-nombre" name="nombre" type="text" autocomplete="name" required value="<?= $name ?>"<?= isset($fieldErrors['nombre']) ? ' aria-invalid="true" aria-describedby="response-nombre-error"' : '' ?>>
                  <?php if (isset($fieldErrors['nombre'])): ?><span class="field-error" id="response-nombre-error"><?= escapeHtml($fieldErrors['nombre']) ?></span><?php endif; ?>
                </div>
                <div class="form-field">
                  <label for="response-email">Correo electrónico</label>
                  <input id="response-email" name="email" type="email" autocomplete="email" required value="<?= $email ?>"<?= isset($fieldErrors['email']) ? ' aria-invalid="true" aria-describedby="response-email-error"' : '' ?>>
                  <?php if (isset($fieldErrors['email'])): ?><span class="field-error" id="response-email-error"><?= escapeHtml($fieldErrors['email']) ?></span><?php endif; ?>
                </div>
                <p>Nombre, correo y mensaje son obligatorios.</p>
                <div class="form-field">
                  <label for="response-servicio">Servicio (opcional)</label>
                  <select id="response-servicio" name="servicio"<?= isset($fieldErrors['servicio']) ? ' aria-invalid="true" aria-describedby="response-servicio-error"' : '' ?>>
                    <option value="">Sin seleccionar</option>
                    <?php foreach ($serviceLabels as $slug => $label): ?>
                    <option value="<?= escapeHtml($slug) ?>"<?= $selectedService === $slug ? ' selected' : '' ?>><?= escapeHtml($label) ?></option>
                    <?php endforeach; ?>
                  </select>
                  <?php if (isset($fieldErrors['servicio'])): ?><span class="field-error" id="response-servicio-error"><?= escapeHtml($fieldErrors['servicio']) ?></span><?php endif; ?>
                </div>
                <div class="form-field">
                  <label for="response-mensaje">¿En qué podemos ayudarle?</label>
                  <textarea id="response-mensaje" name="mensaje" rows="5" required<?= isset($fieldErrors['mensaje']) ? ' aria-invalid="true" aria-describedby="response-mensaje-error"' : '' ?>><?= $body ?></textarea>
                  <?php if (isset($fieldErrors['mensaje'])): ?><span class="field-error" id="response-mensaje-error"><?= escapeHtml($fieldErrors['mensaje']) ?></span><?php endif; ?>
                </div>
                <button class="button button--light" type="submit">Enviar consulta</button>
              </form>
            <?php endif; ?>
            <a class="button button--light response-action" href="<?= escapeHtml($buttonTarget) ?>"><?= escapeHtml($buttonLabel) ?></a>
            <p class="response-contact">También puede escribir a <a href="mailto:secretaria@forestalgaruhape.com.ar">secretaria@forestalgaruhape.com.ar</a>.</p>
          </div>
        </main>
      </body>
    </html>
    <?php
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    if ($isJson) {
        respondJson(405, ['ok' => false]);
    }

    if ($_SERVER['REQUEST_METHOD'] === 'GET' && ($_GET['contacto'] ?? '') === 'enviado') {
        renderContactResponse('Consulta enviada', 'El envío fue aceptado. Gracias por comunicarse con Forestal Garuhapé SA.', false);
    }

    if ($_SERVER['REQUEST_METHOD'] === 'GET' && ($_GET['contacto'] ?? '') === 'error') {
        http_response_code(503);
        renderContactResponse('No se pudo enviar la consulta', 'El formulario no pudo procesar la consulta. Puede intentarlo nuevamente o utilizar los datos de contacto.', true);
    }

    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        header('Location: /#contacto', true, 303);
        exit;
    }

    http_response_code(405);
    header('Allow: GET, POST');
    renderContactResponse('Método no disponible', 'Esta dirección solo acepta el envío del formulario de contacto.', true);
}

$name = trim((string)($_POST['nombre'] ?? ''));
$email = trim((string)($_POST['email'] ?? ''));
$message = trim((string)($_POST['mensaje'] ?? ''));
$serviceInput = $_POST['servicio'] ?? '';
$service = is_string($serviceInput) ? trim($serviceInput) : '';
$invalidService = !is_string($serviceInput) || ($service !== '' && !isset($serviceLabels[$service]));

if (!empty($_POST['website'] ?? '')) {
    if ($isJson) respondJson(200, ['ok' => true]);
    header('Location: /enviar_mensaje.php?contacto=enviado', true, 303);
    exit;
}

$fieldErrors = [];
if ($invalidService) $fieldErrors['servicio'] = 'Seleccione uno de los servicios disponibles.';
if ($name === '') $fieldErrors['nombre'] = 'Escriba su nombre.';
if ($email === '') {
    $fieldErrors['email'] = 'Escriba su correo electrónico.';
} elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $fieldErrors['email'] = 'Escriba una dirección de correo válida.';
}
if ($message === '') $fieldErrors['mensaje'] = 'Escriba su mensaje.';

if ($fieldErrors !== []) {
    if ($isJson) respondJson(422, ['ok' => false, 'fieldErrors' => $fieldErrors]);
    http_response_code(422);
    renderContactResponse('Revise el formulario', 'Algunos campos necesitan su atención. Sus datos siguen disponibles para corregirlos.', true, [
        'nombre' => $name,
        'email' => $email,
        'mensaje' => $message,
    'servicio' => $service,
    ], $fieldErrors);
}

$cleanName = str_replace(["\r", "\n"], ' ', $name);
$subject = 'Consulta desde la web de ' . $siteName;
$body = implode("\n", [
    'Nueva consulta recibida desde el formulario web.',
    '',
    'Nombre: ' . $cleanName,
    'Email: ' . $email,
    'Servicio: ' . ($serviceLabels[$service] ?? 'Sin seleccionar'),
    '',
    'Mensaje:',
    $message,
    '',
    'IP: ' . ($_SERVER['REMOTE_ADDR'] ?? 'desconocida'),
]);

$headers = [
    'From: ' . $siteName . ' <no-reply@forestalgaruhape.com.ar>',
    'Reply-To: ' . $email,
    'Content-Type: text/plain; charset=UTF-8',
    'X-Mailer: PHP/' . phpversion(),
];

$sent = @mail($recipient, $subject, $body, implode("\r\n", $headers));
if ($isJson) {
    if ($sent) respondJson(200, ['ok' => true]);
    respondJson(503, ['ok' => false]);
}

if ($sent) {
    header('Location: /enviar_mensaje.php?contacto=enviado', true, 303);
    exit;
}

http_response_code(503);
renderContactResponse('No se pudo enviar la consulta', 'El formulario no pudo procesar la consulta. Sus datos siguen disponibles para reintentar.', true, [
    'nombre' => $name,
    'email' => $email,
    'mensaje' => $message,
    'servicio' => $service,
]);
