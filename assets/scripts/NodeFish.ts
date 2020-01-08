/*
 * @Author: xxZhang
 * @Date: 2019-12-30 17:15:57
 * @Description: 鱼节点
 */

const {ccclass, property} = cc._decorator;

@ccclass
export default class NodeFish extends cc.Component {

    _fishRect: cc.Rect              = null;         // 鱼的检测碰撞矩形

    start () {
        
    }

    initFish() {
        this.node.position = cc.v2(-20, -20);
        let bezierMove = cc.bezierTo(20, this.getBezierPoses());
        this.node.runAction(bezierMove);
    }

    getBezierPoses() {
        let posList = [];
        posList = [
            cc.v2(100, 100),
            cc.v2(600, 200),
            cc.v2(1500, 1000)
        ];
        return posList;
    }
}
