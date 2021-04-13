import { differenceInHours, format, addHours } from 'date-fns';
import { firebaseServer } from "../../config/firebase/server"

const db = firebaseServer.firestore();
const profile = db.collection('profiles');
const agenda = db.collection('agenda');

const startAt = new Date(2021, 1, 1, 8, 0);
const endAt = new Date(2021, 1, 1, 17, 0);
const totalhours = differenceInHours(endAt, startAt);

const timeBlocks = [];

for(let blockIndex = 0; blockIndex <= totalhours; blockIndex++) {
    const time = format(addHours(startAt, blockIndex), 'HH:mm');
    timeBlocks.push(time);
}

const getUserId = async (username) => {
    const profileDoc = await profile.where('username', '==', username).get();
    if(!profileDoc.docs.length) {
        return false;
    }

    const { userId } = profileDoc.docs[0].data();

    return userId;
}

const setSchedule = async (req, res) => {    
    const userId = await getUserId(req.body.username);
    const docId = `${userId}#${req.body.date}#${req.body.time}`

    const doc = await agenda.doc(docId).get();

    if(doc.exists) {        
        res.status(400).json({ message: "Time is Blocked!" });
        return;
    }

    const block = await agenda.doc(docId).set({
        userId,
        date: req.body.date,
        time: req.body.time,
        name:req.body.name,
        phone:req.body.phone,
    })

    return res.status(200).json(block);
}

const getSchedule = async (req, res) => {
    try {                        
        const userId = await getUserId(req.query.username);
        if(!userId) {
            res.status(404).json({ message: "User not found!" });;
            return;
        }

        const snapshot = await agenda
            .where('userId', '==', userId)
            .where('date', '==', req.query.date)
            .get();

        const blocks = snapshot.docs.map(doc => doc.data());
        
        const result = timeBlocks.map(time => ({
            time,
            isBlocked: !!blocks.find(doc => doc.time === time),
        }));

        return res.status(200).json(result);        
    } catch(error) {
        console.log('ERROR:', error);
        return res.status(401);
    }  
}

const methods = {
    POST: setSchedule,
    GET: getSchedule
}

export default async (req, res)  => methods[req.method] 
    ? methods[req.method](req, res) 
    : res.status(405);