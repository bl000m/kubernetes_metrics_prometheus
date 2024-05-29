const express = require('express');
const promClient = require('prom-client');
const app = express();
const port = process.env.PORT || 3000;
const message = process.env.WELCOME_MESSAGE || 'Bienvenue sur mon application!';

// Créer un compteur pour le nombre de requêtes sur la route "/"
const requestCounter = new promClient.Counter({
  name: 'http_requests_total',
  help: 'Nombre total de requêtes HTTP reçues',
  labelNames: ['method', 'route']
});

// Configurer Prometheus pour collecter les métriques par défaut
promClient.collectDefaultMetrics();

app.get('/', (req, res) => {
  // Incrémenter le compteur pour chaque requête sur la route "/"
  requestCounter.inc({ method: req.method, route: req.route.path });
  res.send(message);
});

// Ajouter une route pour exposer les métriques Prometheus
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', promClient.register.contentType);
  res.end(await promClient.register.metrics());
});

app.listen(port, () => {
  console.log(`Application démarrée sur http://localhost:${port}`);
});

