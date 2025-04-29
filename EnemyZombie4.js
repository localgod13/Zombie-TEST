function _assert_this_initialized(self) {
    if (self === void 0) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }
    return self;
}
function _call_super(_this, derived, args) {
    derived = _get_prototype_of(derived);
    return _possible_constructor_return(_this, _is_native_reflect_construct() ? Reflect.construct(derived, args || [], _get_prototype_of(_this).constructor) : derived.apply(_this, args));
}
function _class_call_check(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _create_class(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
}
function _get_prototype_of(o) {
    _get_prototype_of = Object.setPrototypeOf ? Object.getPrototypeOf : function getPrototypeOf(o) {
        return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _get_prototype_of(o);
}
function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function");
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: {
            value: subClass,
            writable: true,
            configurable: true
        }
    });
    if (superClass) _set_prototype_of(subClass, superClass);
}
function _instanceof(left, right) {
    if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) {
        return !!right[Symbol.hasInstance](left);
    } else {
        return left instanceof right;
    }
}
function _possible_constructor_return(self, call) {
    if (call && (_type_of(call) === "object" || typeof call === "function")) {
        return call;
    }
    return _assert_this_initialized(self);
}
function _set_prototype_of(o, p) {
    _set_prototype_of = Object.setPrototypeOf || function setPrototypeOf(o, p) {
        o.__proto__ = p;
        return o;
    };
    return _set_prototype_of(o, p);
}
function _type_of(obj) {
    "@swc/helpers - typeof";
    return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
}
function _is_native_reflect_construct() {
    try {
        var result = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}));
    } catch (_) {}
    return (_is_native_reflect_construct = function() {
        return !!result;
    })();
}
import Phaser from 'https://esm.sh/phaser@3.60.0';
import { Enemy } from './Enemy.js'; // Import the base Enemy class
var GRID_SIZE = 32; // TODO: Import from constants or pass dynamically
export var EnemyZombie4 = /*#__PURE__*/ function(Enemy) {
    "use strict";
    _inherits(EnemyZombie4, Enemy);
    function EnemyZombie4(scene, x, y, player, roundNumber) {
        _class_call_check(this, EnemyZombie4);
        var _this;
        // Call the parent constructor with the specific texture key for zombie 4
        _this = _call_super(this, EnemyZombie4, [
            scene,
            x,
            y,
            'enemy_zombie4_walk',
            player,
            roundNumber
        ]); // Use the zombie4 walk sheet initially
        // --- Override or Set Different Stats for Zombie 4 ---
        _this.setData('health', 6); // Example: Zombie 4 is the toughest (6 vs 5 vs 4 vs 3)
        // this.speedMultiplier = 0.8; // Example: Maybe make it a bit slower? (Optional)
        // --- Ensure Correct Initial Animation ---
        // Stop any animation started by parent constructor and play the correct one
        _this.anims.stop();
        _this.anims.play('zombie4_walk', true); // Play the correct walk animation
        return _this;
    }
    _create_class(EnemyZombie4, [
        {
            // --- Override takeDamage to use Zombie 4 animations ---
            key: "takeDamage",
            value: function takeDamage(amount) {
                var _this = this;
                if (this.getData('isDying') || this.getData('isCorpse')) return;
                var currentHealth = this.getData('health') || 0;
                currentHealth -= amount;
                this.setData('health', currentHealth);
                console.log("EnemyZombie4 health: ".concat(currentHealth));
                if (this.body) {
                    this.body.setVelocity(0, 0);
                }
                if (currentHealth > 0) {
                    var _this_anims_currentAnim;
                    // --- Play Zombie 4 Hurt Animation ---
                    if (this.active && this.anims && ((_this_anims_currentAnim = this.anims.currentAnim) === null || _this_anims_currentAnim === void 0 ? void 0 : _this_anims_currentAnim.key) !== 'zombie4_hurt' && !this.getData('isDying')) {
                        this.anims.play('zombie4_hurt', true).once('animationcomplete', function() {
                            if (_this.active && !_this.getData('isDying')) {
                                _this.anims.play('zombie4_walk', true);
                            }
                        });
                    }
                } else {
                    // --- Play Zombie 4 Death Sequence ---
                    if (!this.getData('isDying')) {
                        this.setData('isDying', true);
                        if (this.body) {
                            this.body.enable = false;
                        }
                        var onDeathAnimationComplete = function() {
                            if (_this.active) {
                                _this.anims.stop();
                                // Set texture to the last frame of the zombie4 dead animation (index 4)
                                var lastFrameIndex = 4; // 640 / 128 = 5 frames (0-4)
                                _this.setTexture('enemy_zombie4_dead', lastFrameIndex);
                                _this.setData('isCorpse', true);
                                _this.setActive(false);
                                _this.setDepth(-1);
                                if (_this.body) _this.body.enable = false;
                                console.log("EnemyZombie4 died and became a corpse.");
                                
                                // --- Add Blood Pool ---
                                var bloodPool = _this.scene.add.image(_this.x, _this.y + (_this.body.height / 2), 'red-ink-stains');
                                bloodPool.setDepth(_this.depth - 1);
                                bloodPool.setScale(Phaser.Math.FloatBetween(0.03, 0.05));
                                bloodPool.setAlpha(Phaser.Math.FloatBetween(0.6, 0.9));
                                bloodPool.setAngle(Phaser.Math.Between(0, 359));
                                bloodPool.setTint(0xAA0000);
                                // --- End Blood Pool ---
                            }
                        };
                        // Listen for the specific zombie4 animation complete event
                        this.once('animationcomplete-zombie4_dead', onDeathAnimationComplete);
                        if (this.anims) {
                            this.anims.play('zombie4_dead', true);
                        }
                        if (this.body) {
                            this.body.setVelocity(0, 0);
                        }
                    }
                }
            }
        },
        {
            // --- Override attack to use Zombie 4 animation ---
            key: "attack",
            value: function attack(target) {
                var _this = this;
                var _this_anims_currentAnim;
                if (this.getData('isDying') || this.getData('isCorpse') || !this.active || !this.getData('canDealDamage')) return;
                console.log("EnemyZombie4 attacking ".concat(_instanceof(target, Phaser.GameObjects.Sprite) ? target.texture.key : 'block'));
                this.setData('canDealDamage', false);
                if (this.body) {
                    this.body.setVelocity(0, 0);
                }
                // Play zombie 4 attack animation
                if (this.anims && ((_this_anims_currentAnim = this.anims.currentAnim) === null || _this_anims_currentAnim === void 0 ? void 0 : _this_anims_currentAnim.key) !== 'zombie4_attack' && !this.getData('isDying')) {
                    this.anims.play('zombie4_attack', true).once('animationcomplete', function() {
                        if (_this.active && !_this.getData('isDying')) {
                            _this.anims.play('zombie4_walk', true);
                            _this.scene.time.delayedCall(200, function() {
                                if (_this.active) {
                                    _this.setData('canDealDamage', true);
                                }
                            });
                        } else if (!_this.active) {
                            _this.setData('canDealDamage', true);
                        }
                    });
                } else {
                    this.scene.time.delayedCall(500, function() {
                        if (_this.active) {
                            _this.setData('canDealDamage', true);
                        }
                    });
                }
            }
        }
    ]);
    return EnemyZombie4;
}(Enemy);
