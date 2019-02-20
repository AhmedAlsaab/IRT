import moment from 'moment';

const days = [ 'Today', 'Tomorrow', moment().add(2, 'days').format('ddd, MMM D') ];
const times = [ '9:00 AM', '11:10 AM', '12:00 PM', '1:50 PM', '4:30 PM', '6:00 PM', '7:10 PM', '9:45 PM' ];

export default tickets = [
    {
        To: 'Cardiff Queen Street',
        From: 'Caerphilly',
        qr: 'http://imgur.com/gallery/CzZlUnX',
        days,
        times,
      },{
        To: 'Cardiff Central',
        From: 'The valleys',
        qr: 'http://imgur.com/gallery/CzZlUnX',
        days,
        times,
      },{
        To: 'Cathays',
        From: 'Monmouthshire',
        qr: 'http://imgur.com/gallery/CzZlUnX',
        days,
        times,
      },{
        To: 'Roath',
        From: 'Llanrhumney',
        qr: 'http://imgur.com/gallery/CzZlUnX',
        days,
        times,
      },
];