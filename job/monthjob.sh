//////month job //////////////////////
//init lesson instances state data
db.wxusers.find().forEach(function(user){
    user.lessonIns.forEach(function(lessonIns){
        lessonIns.monthTimes=0
    })
    db.wxusers.updateOne({_id:user._id},{$set:user})
})