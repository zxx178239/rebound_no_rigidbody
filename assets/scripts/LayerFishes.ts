/*
 * @Author: xxZhang
 * @Date: 2019-12-30 17:22:52
 * @Description: 鱼层
 */

const {ccclass, property} = cc._decorator;

@ccclass
export default class LayerFishes extends cc.Component {

    @property(cc.Prefab)
    prefabFish: cc.Prefab           = null;

    _fishManager: cc.NodePool       = null;

    start () {
        this._fishManager = new cc.NodePool();
        this.geneFish();
        this.schedule(this.geneFish.bind(this), 5);
    }

    onDestroy() {
        this._fishManager.clear();
        this.unschedule(this.geneFish.bind(this));
    }

    update() {
        
    }

    geneFish() {
        let newFish = null;
        if(this._fishManager.size() > 0) {
            newFish = this._fishManager.get();
        }else {
            newFish = cc.instantiate(this.prefabFish);
        }
        newFish.parent = this.node;
        newFish.getComponent("NodeFish").initFish();
    }
}
