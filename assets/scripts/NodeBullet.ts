/*
 * @Author: xxZhang
 * @Date: 2019-12-30 13:05:17
 * @Description: 子弹节点
 */

 // 反弹的线
export const REBOUND_LINES = {
    TOP_LINE: 1,
    LEFT_LINE: 2,
    BOTTOM_LINE: 3,
    RIGHT_LINE: 4
}

const {ccclass, property} = cc._decorator;

@ccclass
export default class NodeBullet extends cc.Component {

    _bulletRect: cc.Rect            = null;

    _isRebound: boolean             = true;
    
    _isDestroy: boolean             = false;

    _speed: number                  = 500;

    _speedX: number                 = -1;
    _speedY: number                 = -1;

    start () {
        let nodeRect = this.node.getChildByName("NodeRect");
        this._bulletRect = new cc.Rect(nodeRect.x, nodeRect.y,
                                        nodeRect.width, nodeRect.height);
    }

    initBullet(INDegree) {
        this._isDestroy = false;
        this.node.angle = -INDegree;
        console.log("this.node.angle: ", this.node.angle);
        let tmpValue = -this.node.angle;
        tmpValue = Math.PI / 180 * tmpValue; 
        this._speedX = this._speed * Math.sin(tmpValue);
        this._speedY = this._speed * Math.cos(tmpValue);

        // console.log("tmpValue, x, y: ", tmpValue, this._speedX, this._speedY);
    }

    update(dt) {
        if(this._isDestroy) {
            return;
        }

        let boundRtn = this._isBoundary();
        if(!boundRtn) {
            this._doMoveBullet(dt);
            return;
        }

        if(this._isRebound) {
            this._reboundNode(boundRtn);
            this._doMoveBullet(dt);
        }else {

        }
    }

    private _reboundNode(INBoundValue) {
        let newAngle = 0;
        let vecRebound = null;
        let vecNormal = null;        // 法线
        let vecIncident = null;      // 入射角

        // 获取法线
        if(INBoundValue == REBOUND_LINES.TOP_LINE) {
            vecNormal = cc.v2(0, 1);
        }else if(INBoundValue == REBOUND_LINES.LEFT_LINE) {
            vecNormal = cc.v2(1, 0);
        }else if(INBoundValue == REBOUND_LINES.BOTTOM_LINE) {
            vecNormal = cc.v2(0, 1);
        }else if(INBoundValue == REBOUND_LINES.RIGHT_LINE) {
            vecNormal = cc.v2(1, 0);
        }

        // 计算入射角
        vecIncident = this._calIncident();

        // 计算反射角向量
        vecRebound = vecIncident.sub(vecNormal.mul(2 * (vecIncident.dot(vecNormal))));

        // 根据反射向量计算反射角
        let tmpRadian = vecRebound.signAngle(cc.v2(1, 0));
        newAngle = Math.floor(cc.misc.radiansToDegrees(tmpRadian)) + 90;
        newAngle = (newAngle > 360) ? (newAngle - 360) : newAngle;
        this.node.angle = -newAngle;

        // 重新设置x轴和y轴的速度
        let tmpValue = -this.node.angle;
        tmpValue = Math.PI / 180 * tmpValue; 
        this._speedX = this._speed * Math.sin(tmpValue);
        this._speedY = this._speed * Math.cos(tmpValue);
    }

    private _doMoveBullet(dt) {
        let curPos = this.node.position;
        let newX = curPos.x + dt * this._speedX;
        let newY = curPos.y + dt * this._speedY;

        this.node.position = cc.v2(newX, newY);
    }

    private _calIncident() {
        let curPos = this.node.position;
        let newX = curPos.x + 0.1 * this._speedX;
        let newY = curPos.y + 0.1 * this._speedY;
        return (cc.v2(newX, newY)).subSelf(curPos).normalizeSelf();
    }

    private _isBoundary() {
        // return (cc.Intersection.lineRect(cc.v2(0, 0), cc.v2(0, cc.winSize.height), this._bulletRect)) ||
        //         (cc.Intersection.lineRect(cc.v2(0, 0), cc.v2(0, cc.winSize.width), this._bulletRect)) ||
        //         (cc.Intersection.lineRect(cc.v2(cc.winSize.width, cc.winSize.height), cc.v2(0, cc.winSize.height), this._bulletRect)) ||
        //         (cc.Intersection.lineRect(cc.v2(cc.winSize.width, cc.winSize.height), cc.v2(cc.winSize.width, 0), this._bulletRect));

        if(this.node.y >= cc.winSize.height) {
            return REBOUND_LINES.TOP_LINE;
        }else if(this.node.x <= 0) {
            return REBOUND_LINES.LEFT_LINE;
        }else if(this.node.y <= 0) {
            return REBOUND_LINES.BOTTOM_LINE;
        }else if(this.node.x >= cc.winSize.width) {
            return REBOUND_LINES.RIGHT_LINE;
        }else {
            return 0;
        }
    }
}
