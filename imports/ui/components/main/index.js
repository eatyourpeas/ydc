import { composeWithTracker } from 'react-komposer';
import HomeSection from './react-components/home.jsx';
import { DocHead } from 'meteor/kadira:dochead';
import { Chats } from '../../../api/announcements/announcements.js';

function composer(props, onData) {
    const handle = Meteor.subscribe('findAllAnnouncementsAtMyCentre');
    if(handle.ready()) {
        const announcements = Announcements.find({}, {sort: {createdAt: -1}}).fetch();
        onData(null, {announcements});
    }
    DocHead.setTitle('Announcement demo');
    let metaInfo = {
        name: "http-equiv", content: "Content-Security-Policy",
        name: "content", content: "default-src 'self' 'unsafe-inline' 'unsafe-eval' https://yourdomain.com wss://yourdomain.com https://enginex.kadira.io"
    };
    DocHead.addMeta(metaInfo);
}

export default composeWithTracker(composer)(HomeSection);
