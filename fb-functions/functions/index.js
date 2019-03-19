const functions = require('firebase-functions');

const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) => {
  response.send("Hello from Firebase!");
 });



exports.insertIntoDB = functions.https.onRequest((req, res) => {
    const text = req.query.text;
   return  admin.database().ref('/test').push({text: text}).then(snapshot => {
        return res.redirect(303, snapshot.ref.toString());
        
    })
    /*.catch(error => {
        console.error(error);
        res.error(500);
    });*/
});

exports.convertToUppercase = functions.database.ref('/test/{pushId}/text').onCreate((snapshot, context) => {
    const text = snapshot.val();
    console.log('Uppercasing', context.params.pushId, text);
    const uppercaseText = text.toUpperCase();
    return snapshot.ref.parent.child('uppercaseText').set(uppercaseText);
}); 
