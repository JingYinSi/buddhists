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
const yesterday = {
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
    db.wxusers.find({_id: item._id.user, "lessonIns._id": item._id.lessonInsId}).forEach(function (user) {
        user.lessonIns.forEach(function (userLessonInstance) {
            let lessones = db.lessons.find({"instances._id": item._id.lessonInsId});
            if(lessones.length<=0 || lessones[0].instances.length<=0) return;
            let lesson = lessones[0],lessonInstance = lesson.instances[0];
            
            let newLessonDays = 1;
            if (lessonInstance.target && lessonInstance.target > 0) {
                newLessonDays = Math.ceil(item.times / lessonInstance.target)
            } else if (lesson.target && lesson.target > 0) {
                newLessonDays = Math.ceil(item.times / lesson.target)
            }

            lessonInstance.lessonDays = lessonInstance.lessonDays + newLessonDays;
            db.wxusers.updateOne({_id: user._id}, {$set: user})
        })
    })
})
//#endregion