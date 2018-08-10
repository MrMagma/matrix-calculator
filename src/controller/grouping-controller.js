let groupings = [];
let gDict = {};
let animations = {};
let bound = [];

const FPS = 60;
const DURATION_MS = 500;

function updateBound() {
    let h = groupings.reduce((p = 0, c) => p + c.el.height, 0) + "px";
    for (let id of bound) {
        document.getElementById(id).style.height = h;
    }
}

function clearAnimation(id) {
    if (animations[id]) {
        clearInterval(animations[id].tick);
        delete animations[id];
    }
}

function startAnimation(id, value, el) {
    if (animations[id]) {
        animations.final += value;
    } else {
        let animation = {
            initial: el.height,
            final: value
        };
        let d = 0;

        animation.tick = setInterval(function() {
            let step = ((animation.final - animation.initial) / DURATION_MS) * (1000 / FPS);
            d += step;
            
            if ((step < 0 && animation.initial + d < animation.final) ||
                (step > 0 && animation.initial + d > animation.final) ||
                step === 0) {
                d = animation.final - animation.initial;
            }

            el.height = animation.initial + d;

            if (animation.initial + d === animation.final) {
                clearAnimation(id);
            }

            updateBound();
        }, 1000 / FPS);

        animations[id] = animation;
    }
}

function animatedScrollBy(x, y, dur) {
    let xv = x / dur,
        yv = y / dur,
        lastFrame = Date.now();

    function anim() {
        let currentFrame = Date.now();
        let dx = xv * (currentFrame - lastFrame),
            dy = yv * (currentFrame - lastFrame);

        if (x - dx < 0 && dx > 0) dx = x;
        else if (dx < 0) dx = -x;
        if (y - dy < 0 && dy > 0) dy = y;
        else if (dy < 0) dy = -y;

        window.scrollBy(dx, dy);
        x -= dx;
        y -= dy;
        
        if (x !== 0 || y !== 0) {
            requestAnimationFrame(anim);
            lastFrame = currentFrame;
        }
    }

    requestAnimationFrame(anim);
}

function updateGrouping(grouping) {
    if (grouping.hidden && !grouping.wasHidden) {
        clearAnimation(grouping.id);
        startAnimation(grouping.id, 0, grouping.el);
    } else if (!grouping.hidden && grouping.wasHidden) {
        // clearAnimation(grouping.id);
        // startAnimation(grouping.id, grouping.height, grouping.el);
        clearAnimation(grouping.id);
        grouping.el.height = grouping.height;
        updateBound();
        // Scroll to the new place at 1px/ms
        animatedScrollBy(0, grouping.height, grouping.height);
    } else if (!grouping.hidden && !grouping.wasHidden) {
        clearAnimation(grouping.id);
        let h1 = groupings.reduce((p = 0, c) => p + c.el.height, 0);
        grouping.el.height = grouping.height;
        let h2 = groupings.reduce((p = 0, c) => p + c.el.height, 0);
        updateBound();
        // Maintain scroll position
        window.scrollBy(0, h2 - h1);
    }
}

function updatePageHeight() {
    for (let grouping of groupings) {
        updateGrouping(grouping);
    }
}

export default {
    add(id, hidden) {
        let data = {
            wasHidden: hidden,
            hidden: hidden,
            height: document.getElementById(id).scrollHeight,
            id: id,
            el: {
                height: document.getElementById(id).scrollHeight * !hidden
            }
        };
    
        groupings.push(data);
        gDict[id] = data;
    
        updateGrouping(gDict[id]);
    },
    update(id, hidden=gDict[id].hidden) {
        let original = JSON.parse(JSON.stringify(gDict[id]));

        gDict[id].height = document.getElementById(id).offsetHeight;
        gDict[id].wasHidden = gDict[id].hidden;
        gDict[id].hidden = hidden;
    
        if (original.height !== gDict[id].height ||
            original.wasHidden !== gDict[id].wasHidden ||
            original.hidden !== gDict[id].hidden) {
            updateGrouping(gDict[id]);
        }
    },
    remove(id) {
        delete gDict[id];
    
        for (let i = 0; i < groupings.length; ++i) {
            if (groupings[i].id === id) {
                groupings.splice(i);
                updatePageHeight();
                break;
            }
        }
    },
    height() {
        return groupings.reduce((p = 0, c) => p + c.el.height, 0);
    },
    bindHeight(id) {
        bound.push(id);
    }
};