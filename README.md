# tomgreuter.nl

## Development

Clean dist directory:

```
gulp clean
```

Run build and watch:

```
gulp
```

Separate process: Run web server on http://localhost:8888/:

```
gulp serve
```

## Deployment

```
gulp deploy
```

Deploys contents of (generated) `dist` folder over FTP. Doesn't run build yet!
