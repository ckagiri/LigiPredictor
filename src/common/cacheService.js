"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Observable_1 = require("rxjs/Observable");
const Rx_1 = require("rxjs/Rx");
/**
 * Cache Service is an observables based in-memory cache implementation
 * Keeps track of in-flight observables and sets a default expiry for cached values
 * @export
 * @class CacheService
 */
class CacheService {
    constructor() {
        this.cache = new Map();
        this.inFlightObservables = new Map();
        this.DEFAULT_MAX_AGE = 15 * 60 * 1000;
    }
    /**
     * Gets the value from cache if the key is provided.
     * If no value exists in cache, then check if the same call exists
     * in flight, if so return the subject. If not create a new
     * Subject inFlightObservable and return the source observable.
     */
    get(key, fallback, maxAge) {
        if (this.hasValidCachedValue(key)) {
            // console.log(`%cGetting from cache ${key}`, 'color: green');
            return Observable_1.Observable.of(this.cache.get(key).value);
        }
        if (!maxAge) {
            maxAge = this.DEFAULT_MAX_AGE;
        }
        if (this.inFlightObservables.has(key)) {
            return this.inFlightObservables.get(key);
        }
        else if (fallback && fallback instanceof Observable_1.Observable) {
            this.inFlightObservables.set(key, new Rx_1.Subject());
            // console.log(`%c Calling api for ${key}`, 'color: purple');
            return fallback.do((value) => { this.set(key, value, maxAge); });
        }
        else {
            return Observable_1.Observable.throw('Requested key is not available in Cache');
        }
    }
    /**
     * Sets the value with key in the cache
     * Notifies all observers of the new value
     */
    set(key, value, maxAge = this.DEFAULT_MAX_AGE) {
        this.cache.set(key, { value: value, expiry: Date.now() + maxAge });
        this.notifyInFlightObservers(key, value);
    }
    /**
     * Checks if the a key exists in cache
     */
    has(key) {
        return this.cache.has(key);
    }
    clear() {
        this.cache.clear();
    }
    /**
     * Publishes the value to all observers of the given
     * in progress observables if observers exist.
     */
    notifyInFlightObservers(key, value) {
        if (this.inFlightObservables.has(key)) {
            const inFlight = this.inFlightObservables.get(key);
            const observersCount = inFlight.observers.length;
            if (observersCount) {
                // console.log(`%cNotifying ${inFlight.observers.length} flight subscribers for ${key}`, 'color: blue');
                inFlight.next(value);
            }
            inFlight.complete();
            this.inFlightObservables.delete(key);
        }
    }
    /**
     * Checks if the key exists and   has not expired.
     */
    hasValidCachedValue(key) {
        if (this.cache.has(key)) {
            if (this.cache.get(key).expiry < Date.now()) {
                this.cache.delete(key);
                return false;
            }
            return true;
        }
        else {
            return false;
        }
    }
}
exports.CacheService = CacheService;
//# sourceMappingURL=cacheService.js.map