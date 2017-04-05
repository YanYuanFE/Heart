var mongoose   = require('mongoose');
var Schema = mongoose.Schema;



mongoose.connect('mongodb://127.0.0.1:27017/Heartapp');

const db = mongoose.connection;

db.on('error',console.error.bind(console,'连接错误'));
db.once('open',function(callback) {
    console.log('MongoDB连接成功');
});

var heartSchema = new Schema({
    systolic: Number,//收缩压
    diastolic: Number,//舒张压
    rate: Number,//心率
    time: Date
});

const HeartModel = mongoose.model('Heart', heartSchema);

module.exports = HeartModel;