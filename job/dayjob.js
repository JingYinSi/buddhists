//////day job //////////////////////
//init lesson instances state data

//#region dayTime to 0 every day
db.wxusers.find().forEach(function (user) {
    user.lessonIns.forEach(function (lessonIns) {
        lessonIns.dayTimes = 0
    })
    user.dayLessonInsNumber = 0
    db.wxusers.updateOne({_id: user._id}, {$set: user})
})

//init lesson instance state data
db.lessons.find().forEach(function (lesson) {
    lesson.instances.forEach(function (instance) {
        instance.todayPopulations = 0
        instance.todayTimes = 0
    })
    db.lessons.updateOne({_id: lesson._id}, {$set: lesson})
})
//endregion

//#region user lesson instance days state
let yesterday = {
    date: function () {
        let now = new Date();
        now.setDate(now.getDate() - 1);
        return now;
    },
    begin: function () {
        return new Date(this.date().setHours(0, 0, 0, 0));
    },
    end: function () {
        return new Date(this.date().setHours(23, 59, 59, 999));
    }
};

db.reports.aggregate([
    {
        $match: {
            "createdAt": {
                $gte: yesterday.begin(),
                $lte: yesterday.end()
            }
        }
    },
    {
        $group: {_id: {"user": "$user", "lessonInsId": "$lessonIns"}, times: {$sum: "$times"}}
    }
]).forEach(function (item) {
    //console.log('yesterdayLessonTimes:')
    //console.log(JSON.stringify(item))

    db.wxusers.find({_id: ObjectId(item._id.user), "lessonIns.lessonInsId": ObjectId(item._id.lessonInsId)}).forEach(function (user) {
        //console.log('.............................start.............................')
        //console.log('user:')
        //console.log(JSON.stringify(user))
        //console.log(user.lessonIns.length)
        user.lessonIns.forEach(function (userLessonInstance) {
            if(!userLessonInstance.lessonInsId.equals(item._id.lessonInsId)) {
                //console.log(item._id.lessonInsId)
                //console.log(userLessonInstance.lessonInsId)
                return;
            }
            //console.log('userLessonInstance:')
            //console.log(JSON.stringify(userLessonInstance))
            let lesson = db.lessons.findOne({"instances._id": ObjectId(item._id.lessonInsId)});

            if(!lesson) return;

            //console.log('lesson:')
            //console.log(JSON.stringify(lesson))

            lessonInstance= lesson.instances[0]
            //console.log('lessonInstance:')
            //console.log(JSON.stringify(lessonInstance))

            let newLessonDays = 1;
            if (userLessonInstance.target && userLessonInstance.target > 0) {
                newLessonDays = Math.ceil(item.times / userLessonInstance.target)
            } else if (lessonInstance.target && lessonInstance.target > 0) {
                newLessonDays = Math.ceil(item.times / lessonInstance.target)
            }
            //console.log('newLessonDays:' + newLessonDays)
            if(!userLessonInstance.lessonDays) {
                userLessonInstance.lessonDays = 0
            }
            userLessonInstance.lessonDays += newLessonDays;
            //console.log('lessonDays:' + userLessonInstance.lessonDays)
        })
        db.wxusers.updateOne({_id: user._id}, {$set: user})
        //console.log('.............................end.............................')
    })
})
//#endregion