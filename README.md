# Race Day FPV

## Web app

### Requirements
- Firebase CLI: `npm install firebase-tools`
- update `firebase.json` with your production firebase id

### Environment
Make sure you have a `.env.json` file available in your project root for setting up your dev and prod environments

```
// .env.json

{
	"FIREBASE_DEV_URL": "https://YOUR-DEV-ID.firebaseio.com",
	"FIREBASE_PROD_URL": "https://YOUR-PROD-ID.firebaseio.com",
	"WHATSAPP_RECIPIENTS_DEV": "['xxxxxxxxxx','xxxxxxxxxx']",
	"WHATSAPP_RECIPIENTS_PROD": "['xxxxxxxxxx-xxxxxxxxxx']",
	"WHATSAPP_LOGIN": "xxxxxxxxxx",
	"WHATSAPP_PASSWORD": "WhAtSaPpPaSsWoRd",
	"SLACK_API_TOKEN": "SlAcK-ApI-tOkEn"
}

```
### Testing
When running `gulp serve` the `FIREBASE_DEV_URL` URL will be used

### Building
When building with `gulp`, `FIREBASE_PROD_URL` will be used. To test built app you can run `firebase serve`

### Deploy
To deploy your app, run `firebase deploy`

## Server

### Notifications Monitor
There is a small server that monitors a queue on firebase and sends out notifications to both WhatsApp as well as a Slack channel
