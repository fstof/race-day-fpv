# Race Day FPV

## Requirements
	- Firebase CLI: `npm install firebase-tools`
	- update `firebase.json` with your production firebase id

## Environment
	Make sure you have a `.env.json` file available in your project root for setting up your firebase URL's (dev and prod)

```
// .env.json

{
    "FIREBASE_ID_DEV": "https://YOUR-DEV-ID.firebaseio.com",
    "FIREBASE_ID_PROD": "https://YOUR-PROD-ID.firebaseio.com"
}

```	
## Testing
	When running `gulp serve` the `FIREBASE_ID_DEV` URL will be used

## Building
	When building with `gulp build`, `FIREBASE_ID_PROD` will be used. To test buit app you can run `firebase serve`

## Deploy
	To deploy your app, run `firebase deploy`
