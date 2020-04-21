let GroupGameHistory = require('./GroupGameHistory.js')

module.exports = class GroupHistory {


    constructor(groupName) {

        this.groupName = groupName;
        this.groupGameHistoryList = new Array(GroupGameHistory)
    }

    getGroupName() {
        return this.groupName
    }
    setGroupName(value) {
        this.groupName = value
    }

    getGroupGameHistoryList() {
        return this.groupGameHistoryList
    }
    // setGroupGameHistoryList(value) {
    //     this.groupGameHistoryList = value
    // }
    
    addGameHistory(value){
        if(this.groupGameHistoryList == null || this.groupGameHistoryList == undefined) {
            this.groupGameHistoryList = new Array(GroupGameHistory)
        }
        this.groupGameHistoryList.push(value)
    }



}