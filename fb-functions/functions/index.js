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

exports.findNotCount = functions.database.ref('test/{pushId}/text').onWrite((change, context) => { 
    var test_id = admin.database.ref("/test/" +context.params.pushId);
    test_id.once('value', (test_event) => {
        console.log("test objects" + JSON.stringify(test_event));
        var  cn = 0;
        for(var i= 0 ; i < test_id.length -1 ; i++ ){
            if(test_id.child("text").equals("false")){
                cn++;
            }
        }
        admin.data.ref('/test').push({"count_text" : cn});
    })
        
});