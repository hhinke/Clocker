import { firebaseServer } from "../../config/firebase/server";

const db = firebaseServer.firestore();
const agenda = db.collection('agenda');

export default async (req, res)  => {        
    if(!req.headers.authorization) {
        return res.status(401);
    }

    try {
        const [, token] = req.headers.authorization.split(' ');
        const { user_id } = await firebaseServer.auth().verifyIdToken(token);

        const snapshot = await agenda
            .where('userId', '==', user_id)
            .where('date', '==', req.query.date)
            .get();

        const blocks = snapshot.docs.map(doc => doc.data());

        return res.status(200).json(blocks);
    } catch(error) {
        console.log('ERROR:', error);
        return res.status(401);
    }   
}