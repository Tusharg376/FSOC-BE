const messageModel = require('../../models/messageModel')

module.exports.getAllMessages = async function(data) {
    try {
        let result = await messageModel.find({roomId: data}).populate({path:'sender',select:'name createdAt'})
        .populate({ 
            path: 'roomId', 
            select:'isPrivate roomName roomAdmin profile ',
            populate: { path: 'roomAdmin',
                        select: 'email'} 
        })
        .exec();
        return result
    } catch (error) {
        throw error
    }
}

module.exports.sendMessage = async function(data){
    try {
        let result = await messageModel.create(data)
        return result
    } catch (error) {
        throw error
    }
}
