"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var List = (function () {
    function List(elements) {
        if (elements === void 0) { elements = []; }
        this._elements = elements;
    }
    List.prototype.Add = function (element) {
        this._elements.push(element);
    };
    List.prototype.AddRange = function (elements) {
        (_a = this._elements).push.apply(_a, elements);
        var _a;
    };
    List.prototype.Aggregate = function (accumulator, initialValue) {
        return this._elements.reduce(accumulator, initialValue);
    };
    List.prototype.All = function (predicate) {
        return this._elements.every(predicate);
    };
    List.prototype.Any = function (predicate) {
        return predicate
            ? this._elements.some(predicate)
            : this._elements.length > 0;
    };
    List.prototype.Average = function (transform) {
        return this.Sum(transform) / this.Count(transform);
    };
    List.prototype.Cast = function () {
        return new List(this._elements);
    };
    List.prototype.Concat = function (list) {
        return new List(this._elements.concat(list.ToArray()));
    };
    List.prototype.Contains = function (element) {
        return this._elements.some(function (x) { return x === element; });
    };
    List.prototype.Count = function (predicate) {
        return predicate ? this.Where(predicate).Count() : this._elements.length;
    };
    List.prototype.DefaultIfEmpty = function (defaultValue) {
        return this.Count() ? this : new List([defaultValue]);
    };
    List.prototype.Distinct = function () {
        return this.Where(function (value, index, iter) { return iter.indexOf(value) === index; });
    };
    List.prototype.DistinctBy = function (keySelector) {
        var groups = this.GroupBy(keySelector, function (obj) { return obj; });
        var results = new List();
        for (var index in groups) {
            if (groups.hasOwnProperty(index)) {
                results.Add(groups[index][0]);
            }
        }
        return results;
    };
    List.prototype.ElementAt = function (index) {
        if (index < this.Count()) {
            return this._elements[index];
        }
        else {
            var MSG = 'ArgumentOutOfRangeException: index is less than 0 or greater than or equal to the number of elements in source.';
            throw new Error(MSG);
        }
    };
    List.prototype.ElementAtOrDefault = function (index) {
        return this.ElementAt(index) || undefined;
    };
    List.prototype.Except = function (source) {
        return this.Where(function (x) { return !source.Contains(x); });
    };
    List.prototype.First = function (predicate) {
        if (this.Count()) {
            return predicate ? this.Where(predicate).First() : this._elements[0];
        }
        else {
            throw new Error('InvalidOperationException: The source sequence is empty.');
        }
    };
    List.prototype.FirstOrDefault = function (predicate) {
        return this.Count(predicate) ? this.First(predicate) : undefined;
    };
    List.prototype.ForEach = function (action) {
        return this._elements.forEach(action);
    };
    List.prototype.GroupBy = function (grouper, mapper) {
        return this.Aggregate(function (ac, v) { return (ac[grouper(v)]
            ? ac[grouper(v)].push(mapper(v))
            : (ac[grouper(v)] = [mapper(v)]),
            ac); }, {});
    };
    List.prototype.GroupJoin = function (list, key1, key2, result) {
        return this.Select(function (x, y) {
            return result(x, list.Where(function (z) { return key1(x) === key2(z); }));
        });
    };
    List.prototype.IndexOf = function (element) {
        return this._elements.indexOf(element);
    };
    List.prototype.Insert = function (index, element) {
        if (index < 0 || index > this._elements.length) {
            throw new Error('Index is out of range.');
        }
        this._elements.splice(index, 0, element);
    };
    List.prototype.Intersect = function (source) {
        return this.Where(function (x) { return source.Contains(x); });
    };
    List.prototype.Join = function (list, key1, key2, result) {
        return this.SelectMany(function (x) {
            return list.Where(function (y) { return key2(y) === key1(x); }).Select(function (z) { return result(x, z); });
        });
    };
    List.prototype.Last = function (predicate) {
        if (this.Count()) {
            return predicate
                ? this.Where(predicate).Last()
                : this._elements[this.Count() - 1];
        }
        else {
            throw Error('InvalidOperationException: The source sequence is empty.');
        }
    };
    List.prototype.LastOrDefault = function (predicate) {
        return this.Count(predicate) ? this.Last(predicate) : undefined;
    };
    List.prototype.Max = function () {
        return this.Aggregate(function (x, y) { return (x > y ? x : y); });
    };
    List.prototype.Min = function () {
        return this.Aggregate(function (x, y) { return (x < y ? x : y); });
    };
    List.prototype.OfType = function (type) {
        var typeName;
        switch (type) {
            case Number:
                typeName = typeof 0;
                break;
            case String:
                typeName = typeof '';
                break;
            case Boolean:
                typeName = typeof true;
                break;
            case Function:
                typeName = typeof function () { };
                break;
            default:
                typeName = null;
                break;
        }
        return typeName === null
            ? this.Where(function (x) { return x instanceof type; }).Cast()
            : this.Where(function (x) { return typeof x === typeName; }).Cast();
    };
    List.prototype.OrderBy = function (keySelector) {
        return new OrderedList(this._elements, ComparerHelper.ComparerForKey(keySelector, false));
    };
    List.prototype.OrderByDescending = function (keySelector) {
        return new OrderedList(this._elements, ComparerHelper.ComparerForKey(keySelector, true));
    };
    List.prototype.ThenBy = function (keySelector) {
        return this.OrderBy(keySelector);
    };
    List.prototype.ThenByDescending = function (keySelector) {
        return this.OrderByDescending(keySelector);
    };
    List.prototype.Remove = function (element) {
        return this.IndexOf(element) !== -1
            ? (this.RemoveAt(this.IndexOf(element)), true)
            : false;
    };
    List.prototype.RemoveAll = function (predicate) {
        return this.Where(this._negate(predicate));
    };
    List.prototype.RemoveAt = function (index) {
        this._elements.splice(index, 1);
    };
    List.prototype.Reverse = function () {
        return new List(this._elements.reverse());
    };
    List.prototype.Select = function (mapper) {
        return new List(this._elements.map(mapper));
    };
    List.prototype.SelectMany = function (mapper) {
        var _this = this;
        return this.Aggregate(function (ac, v, i) { return (ac.AddRange(_this.Select(mapper).ElementAt(i).ToArray()),
            ac); }, new List());
    };
    List.prototype.SequenceEqual = function (list) {
        return !!this._elements.reduce(function (x, y, z) { return (list._elements[z] === y ? x : undefined); });
    };
    List.prototype.Single = function () {
        if (this.Count() !== 1) {
            throw new Error('The collection does not contain exactly one element.');
        }
        else {
            return this.First();
        }
    };
    List.prototype.SingleOrDefault = function () {
        return this.Count() ? this.Single() : undefined;
    };
    List.prototype.Skip = function (amount) {
        return new List(this._elements.slice(Math.max(0, amount)));
    };
    List.prototype.SkipWhile = function (predicate) {
        var _this = this;
        return this.Skip(this.Aggregate(function (ac, val) { return (predicate(_this.ElementAt(ac)) ? ++ac : ac); }, 0));
    };
    List.prototype.Sum = function (transform) {
        return transform
            ? this.Select(transform).Sum()
            : this.Aggregate(function (ac, v) { return (ac += +v); }, 0);
    };
    List.prototype.Take = function (amount) {
        return new List(this._elements.slice(0, Math.max(0, amount)));
    };
    List.prototype.TakeWhile = function (predicate) {
        var _this = this;
        return this.Take(this.Aggregate(function (ac, val) { return (predicate(_this.ElementAt(ac)) ? ++ac : ac); }, 0));
    };
    List.prototype.ToArray = function () {
        return this._elements;
    };
    List.prototype.ToDictionary = function (key, value) {
        var _this = this;
        return this.Aggregate(function (o, v, i) { return ((o[_this.Select(key).ElementAt(i).toString()] = value
            ? _this.Select(value).ElementAt(i)
            : v),
            o); }, {});
    };
    List.prototype.ToList = function () {
        return this;
    };
    List.prototype.ToLookup = function (keySelector, elementSelector) {
        return this.GroupBy(keySelector, elementSelector);
    };
    List.prototype.Union = function (list) {
        return this.Concat(list).Distinct();
    };
    List.prototype.Where = function (predicate) {
        return new List(this._elements.filter(predicate));
    };
    List.prototype.Zip = function (list, result) {
        var _this = this;
        return list.Count() < this.Count()
            ? list.Select(function (x, y) { return result(_this.ElementAt(y), x); })
            : this.Select(function (x, y) { return result(x, list.ElementAt(y)); });
    };
    List.prototype._negate = function (predicate) {
        return function () {
            return !predicate.apply(this, arguments);
        };
    };
    return List;
}());
exports.List = List;
var ComparerHelper = (function () {
    function ComparerHelper() {
    }
    ComparerHelper.ComparerForKey = function (_keySelector, descending) {
        return function (a, b) {
            return ComparerHelper.Compare(a, b, _keySelector, descending);
        };
    };
    ComparerHelper.Compare = function (a, b, _keySelector, descending) {
        var sortKeyA = _keySelector(a);
        var sortKeyB = _keySelector(b);
        if (sortKeyA > sortKeyB) {
            if (!descending) {
                return 1;
            }
            else {
                return -1;
            }
        }
        else if (sortKeyA < sortKeyB) {
            if (!descending) {
                return -1;
            }
            else {
                return 1;
            }
        }
        else {
            return 0;
        }
    };
    ComparerHelper.ComposeComparers = function (previousComparer, currentComparer) {
        return function (a, b) {
            var resultOfPreviousComparer = previousComparer(a, b);
            if (!resultOfPreviousComparer) {
                return currentComparer(a, b);
            }
            else {
                return resultOfPreviousComparer;
            }
        };
    };
    return ComparerHelper;
}());
var OrderedList = (function (_super) {
    __extends(OrderedList, _super);
    function OrderedList(elements, _comparer) {
        var _this = _super.call(this, elements) || this;
        _this._comparer = _comparer;
        _this._elements.sort(_this._comparer);
        return _this;
    }
    OrderedList.prototype.ThenBy = function (keySelector) {
        return new OrderedList(this._elements, ComparerHelper.ComposeComparers(this._comparer, ComparerHelper.ComparerForKey(keySelector, false)));
    };
    OrderedList.prototype.ThenByDescending = function (keySelector) {
        return new OrderedList(this._elements, ComparerHelper.ComposeComparers(this._comparer, ComparerHelper.ComparerForKey(keySelector, true)));
    };
    return OrderedList;
}(List));
var Enumerable = (function () {
    function Enumerable() {
    }
    Enumerable.Range = function (start, count) {
        var result = new List();
        while (count--) {
            result.Add(start++);
        }
        return result;
    };
    Enumerable.Repeat = function (element, count) {
        var result = new List();
        while (count--) {
            result.Add(element);
        }
        return result;
    };
    return Enumerable;
}());
exports.Enumerable = Enumerable;
