/*
 * @Author: xxZhang
 * @Date: 2019-12-30 13:17:42
 * @Description: 子弹层
 */

const {ccclass, property} = cc._decorator;

@ccclass
export default class LayerBullets extends cc.Component {

    @property(cc.Prefab)
    prefabBullet: cc.Prefab             = null;

    _bulletManager: cc.NodePool         = null;

    start () {
        this._bulletManager = new cc.NodePool();
        this.registerEvents();
    }

    onDestroy() {
        this.removeEvents();
    }

    registerEvents() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.geneBullet, this);
    }

    removeEvents() {
        this.node.off(cc.Node.EventType.TOUCH_START, this.geneBullet, this);
    }

    geneBullet(event) {
        let touchPos = event.getLocation();

        let degree = this._calAngle(touchPos);

        let nodeBullet = null;
        if(this._bulletManager.size() > 0) {
            nodeBullet = this._bulletManager.get();
        } else {
            nodeBullet = cc.instantiate(this.prefabBullet);
        }
        nodeBullet.parent = this.node;
        nodeBullet.position = touchPos;
        nodeBullet.getComponent("NodeBullet").initBullet(degree);
    }

    private _calAngle(INEndPos) {
        let startPos = cc.v2(cc.winSize.width / 2, 50);

        let dirVec = INEndPos.sub(startPos);        // 得出从起点到终点的向量
        let refVec = cc.v2(1, 0);

        let radian = dirVec.signAngle(refVec);
        let degree = Math.floor(cc.misc.radiansToDegrees(radian));
        
        return degree + 90;         // 注这里+90是因为图片本身默认朝上是0度
    }
}
