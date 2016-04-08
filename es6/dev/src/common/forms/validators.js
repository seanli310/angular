import { isBlank, isPresent, CONST_EXPR, isString } from 'angular2/src/facade/lang';
import { PromiseWrapper } from 'angular2/src/facade/promise';
import { ObservableWrapper } from 'angular2/src/facade/async';
import { StringMapWrapper } from 'angular2/src/facade/collection';
import { OpaqueToken } from 'angular2/core';
/**
 * Providers for validators to be used for {@link Control}s in a form.
 *
 * Provide this using `multi: true` to add validators.
 *
 * ### Example
 *
 * {@example core/forms/ts/ng_validators/ng_validators.ts region='ng_validators'}
 */
export const NG_VALIDATORS = CONST_EXPR(new OpaqueToken("NgValidators"));
/**
 * Providers for asynchronous validators to be used for {@link Control}s
 * in a form.
 *
 * Provide this using `multi: true` to add validators.
 *
 * See {@link NG_VALIDATORS} for more details.
 */
export const NG_ASYNC_VALIDATORS = CONST_EXPR(new OpaqueToken("NgAsyncValidators"));
/**
 * Provides a set of validators used by form controls.
 *
 * A validator is a function that processes a {@link Control} or collection of
 * controls and returns a map of errors. A null map means that validation has passed.
 *
 * ### Example
 *
 * ```typescript
 * var loginControl = new Control("", Validators.required)
 * ```
 */
export class Validators {
    /**
     * Validator that requires controls to have a non-empty value.
     */
    static required(control) {
        return isBlank(control.value) || (isString(control.value) && control.value == "") ?
            { "required": true } :
            null;
    }
    /**
     * Validator that requires controls to have a value of a minimum length.
     */
    static minLength(minLength) {
        return (control) => {
            if (isPresent(Validators.required(control)))
                return null;
            var v = control.value;
            return v.length < minLength ?
                { "minlength": { "requiredLength": minLength, "actualLength": v.length } } :
                null;
        };
    }
    /**
     * Validator that requires controls to have a value of a maximum length.
     */
    static maxLength(maxLength) {
        return (control) => {
            if (isPresent(Validators.required(control)))
                return null;
            var v = control.value;
            return v.length > maxLength ?
                { "maxlength": { "requiredLength": maxLength, "actualLength": v.length } } :
                null;
        };
    }
    /**
     * Validator that requires a control to match a regex to its value.
     */
    static pattern(pattern) {
        return (control) => {
            if (isPresent(Validators.required(control)))
                return null;
            let regex = new RegExp(`^${pattern}$`);
            let v = control.value;
            return regex.test(v) ? null :
                { "pattern": { "requiredPattern": `^${pattern}$`, "actualValue": v } };
        };
    }
    /**
     * No-op validator.
     */
    static nullValidator(c) { return null; }
    /**
     * Compose multiple validators into a single function that returns the union
     * of the individual error maps.
     */
    static compose(validators) {
        if (isBlank(validators))
            return null;
        var presentValidators = validators.filter(isPresent);
        if (presentValidators.length == 0)
            return null;
        return function (control) {
            return _mergeErrors(_executeValidators(control, presentValidators));
        };
    }
    static composeAsync(validators) {
        if (isBlank(validators))
            return null;
        var presentValidators = validators.filter(isPresent);
        if (presentValidators.length == 0)
            return null;
        return function (control) {
            let promises = _executeAsyncValidators(control, presentValidators).map(_convertToPromise);
            return PromiseWrapper.all(promises).then(_mergeErrors);
        };
    }
}
function _convertToPromise(obj) {
    return PromiseWrapper.isPromise(obj) ? obj : ObservableWrapper.toPromise(obj);
}
function _executeValidators(control, validators) {
    return validators.map(v => v(control));
}
function _executeAsyncValidators(control, validators) {
    return validators.map(v => v(control));
}
function _mergeErrors(arrayOfErrors) {
    var res = arrayOfErrors.reduce((res, errors) => {
        return isPresent(errors) ? StringMapWrapper.merge(res, errors) : res;
    }, {});
    return StringMapWrapper.isEmpty(res) ? null : res;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFsaWRhdG9ycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRpZmZpbmdfcGx1Z2luX3dyYXBwZXItb3V0cHV0X3BhdGgtMm5iZ0RobngudG1wL2FuZ3VsYXIyL3NyYy9jb21tb24vZm9ybXMvdmFsaWRhdG9ycy50cyJdLCJuYW1lcyI6WyJWYWxpZGF0b3JzIiwiVmFsaWRhdG9ycy5yZXF1aXJlZCIsIlZhbGlkYXRvcnMubWluTGVuZ3RoIiwiVmFsaWRhdG9ycy5tYXhMZW5ndGgiLCJWYWxpZGF0b3JzLnBhdHRlcm4iLCJWYWxpZGF0b3JzLm51bGxWYWxpZGF0b3IiLCJWYWxpZGF0b3JzLmNvbXBvc2UiLCJWYWxpZGF0b3JzLmNvbXBvc2VBc3luYyIsIl9jb252ZXJ0VG9Qcm9taXNlIiwiX2V4ZWN1dGVWYWxpZGF0b3JzIiwiX2V4ZWN1dGVBc3luY1ZhbGlkYXRvcnMiLCJfbWVyZ2VFcnJvcnMiXSwibWFwcGluZ3MiOiJPQUFPLEVBQUMsT0FBTyxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFDLE1BQU0sMEJBQTBCO09BQzFFLEVBQUMsY0FBYyxFQUFDLE1BQU0sNkJBQTZCO09BQ25ELEVBQUMsaUJBQWlCLEVBQUMsTUFBTSwyQkFBMkI7T0FDcEQsRUFBYyxnQkFBZ0IsRUFBQyxNQUFNLGdDQUFnQztPQUNyRSxFQUFDLFdBQVcsRUFBQyxNQUFNLGVBQWU7QUFLekM7Ozs7Ozs7O0dBUUc7QUFDSCxhQUFhLGFBQWEsR0FBZ0IsVUFBVSxDQUFDLElBQUksV0FBVyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7QUFFdEY7Ozs7Ozs7R0FPRztBQUNILGFBQWEsbUJBQW1CLEdBQWdCLFVBQVUsQ0FBQyxJQUFJLFdBQVcsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLENBQUM7QUFFakc7Ozs7Ozs7Ozs7O0dBV0c7QUFDSDtJQUNFQTs7T0FFR0E7SUFDSEEsT0FBT0EsUUFBUUEsQ0FBQ0EsT0FBb0NBO1FBQ2xEQyxNQUFNQSxDQUFDQSxPQUFPQSxDQUFD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QUFpQkEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7QUFDaEZBLENBQUNBO0FBRUQsNEJBQTRCLE9BQW9DLEVBQ3BDLFVBQXlCO0lBQ25EQyxNQUFNQSxDQUFDQSxVQUFVQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxPQUFPQSxDQUFDQSxDQUFDQSxDQUFDQTtBQUN6Q0EsQ0FBQ0E7QUFFRCxpQ0FBaUMsT0FBb0MsRUFDcEMsVUFBOEI7SUFDN0RDLE1BQU1BLENBQUNBLFVBQVVBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLENBQUNBLE9BQU9BLENBQUNBLENBQUNBLENBQUNBO0FBQ3pDQSxDQUFDQTtBQUVELHNCQUFzQixhQUFvQjtJQUN4Q0MsSUFBSUEsR0FBR0EsR0FDSEEsYUFBYUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsR0FBeUJBLEVBQUVBLE1BQTRCQTtRQUMzRUEsTUFBTUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsR0FBR0EsZ0JBQWdCQSxDQUFDQSxLQUFLQSxDQUFDQSxHQUFHQSxFQUFFQSxNQUFNQSxDQUFDQSxHQUFHQSxHQUFHQSxDQUFDQTtJQUN2RUEsQ0FBQ0EsRUFBRUEsRUFBRUEsQ0FBQ0EsQ0FBQ0E7SUFDWEEsTUFBTUEsQ0FBQ0EsZ0JBQWdCQSxDQUFDQSxPQUFPQSxDQUFDQSxHQUFHQSxDQUFDQSxHQUFHQSxJQUFJQSxHQUFHQSxHQUFHQSxDQUFDQTtBQUNwREEsQ0FBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge2lzQmxhbmssIGlzUHJlc2VudCwgQ09OU1RfRVhQUiwgaXNTdHJpbmd9IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvbGFuZyc7XG5pbXBvcnQge1Byb21pc2VXcmFwcGVyfSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL3Byb21pc2UnO1xuaW1wb3J0IHtPYnNlcnZhYmxlV3JhcHBlcn0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9hc3luYyc7XG5pbXBvcnQge0xpc3RXcmFwcGVyLCBTdHJpbmdNYXBXcmFwcGVyfSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2NvbGxlY3Rpb24nO1xuaW1wb3J0IHtPcGFxdWVUb2tlbn0gZnJvbSAnYW5ndWxhcjIvY29yZSc7XG5cbmltcG9ydCAqIGFzIG1vZGVsTW9kdWxlIGZyb20gJy4vbW9kZWwnO1xuaW1wb3J0IHtWYWxpZGF0b3JGbiwgQXN5bmNWYWxpZGF0b3JGbn0gZnJvbSAnLi9kaXJlY3RpdmVzL3ZhbGlkYXRvcnMnO1xuXG4vKipcbiAqIFByb3ZpZGVycyBmb3IgdmFsaWRhdG9ycyB0byBiZSB1c2VkIGZvciB7QGxpbmsgQ29udHJvbH1zIGluIGEgZm9ybS5cbiAqXG4gKiBQcm92aWRlIHRoaXMgdXNpbmcgYG11bHRpOiB0cnVlYCB0byBhZGQgdmFsaWRhdG9ycy5cbiAqXG4gKiAjIyMgRXhhbXBsZVxuICpcbiAqIHtAZXhhbXBsZSBjb3JlL2Zvcm1zL3RzL25nX3ZhbGlkYXRvcnMvbmdfdmFsaWRhdG9ycy50cyByZWdpb249J25nX3ZhbGlkYXRvcnMnfVxuICovXG5leHBvcnQgY29uc3QgTkdfVkFMSURBVE9SUzogT3BhcXVlVG9rZW4gPSBDT05TVF9FWFBSKG5ldyBPcGFxdWVUb2tlbihcIk5nVmFsaWRhdG9yc1wiKSk7XG5cbi8qKlxuICogUHJvdmlkZXJzIGZvciBhc3luY2hyb25vdXMgdmFsaWRhdG9ycyB0byBiZSB1c2VkIGZvciB7QGxpbmsgQ29udHJvbH1zXG4gKiBpbiBhIGZvcm0uXG4gKlxuICogUHJvdmlkZSB0aGlzIHVzaW5nIGBtdWx0aTogdHJ1ZWAgdG8gYWRkIHZhbGlkYXRvcnMuXG4gKlxuICogU2VlIHtAbGluayBOR19WQUxJREFUT1JTfSBmb3IgbW9yZSBkZXRhaWxzLlxuICovXG5leHBvcnQgY29uc3QgTkdfQVNZTkNfVkFMSURBVE9SUzogT3BhcXVlVG9rZW4gPSBDT05TVF9FWFBSKG5ldyBPcGFxdWVUb2tlbihcIk5nQXN5bmNWYWxpZGF0b3JzXCIpKTtcblxuLyoqXG4gKiBQcm92aWRlcyBhIHNldCBvZiB2YWxpZGF0b3JzIHVzZWQgYnkgZm9ybSBjb250cm9scy5cbiAqXG4gKiBBIHZhbGlkYXRvciBpcyBhIGZ1bmN0aW9uIHRoYXQgcHJvY2Vzc2VzIGEge0BsaW5rIENvbnRyb2x9IG9yIGNvbGxlY3Rpb24gb2ZcbiAqIGNvbnRyb2xzIGFuZCByZXR1cm5zIGEgbWFwIG9mIGVycm9ycy4gQSBudWxsIG1hcCBtZWFucyB0aGF0IHZhbGlkYXRpb24gaGFzIHBhc3NlZC5cbiAqXG4gKiAjIyMgRXhhbXBsZVxuICpcbiAqIGBgYHR5cGVzY3JpcHRcbiAqIHZhciBsb2dpbkNvbnRyb2wgPSBuZXcgQ29udHJvbChcIlwiLCBWYWxpZGF0b3JzLnJlcXVpcmVkKVxuICogYGBgXG4gKi9cbmV4cG9ydCBjbGFzcyBWYWxpZGF0b3JzIHtcbiAgLyoqXG4gICAqIFZhbGlkYXRvciB0aGF0IHJlcXVpcmVzIGNvbnRyb2xzIHRvIGhhdmUgYSBub24tZW1wdHkgdmFsdWUuXG4gICAqL1xuICBzdGF0aWMgcmVxdWlyZWQoY29udHJvbDogbW9kZWxNb2R1bGUuQWJzdHJhY3RDb250cm9sKToge1trZXk6IHN0cmluZ106IGJvb2xlYW59IHtcbiAgICByZXR1cm4gaXNCbGFuayhjb250cm9sLnZhbHVlKSB8fCAoaXNTdHJpbmcoY29udHJvbC52YWx1ZSkgJiYgY29udHJvbC52YWx1ZSA9PSBcIlwiKSA/XG4gICAgICAgICAgICAgICB7XCJyZXF1aXJlZFwiOiB0cnVlfSA6XG4gICAgICAgICAgICAgICBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIFZhbGlkYXRvciB0aGF0IHJlcXVpcmVzIGNvbnRyb2xzIHRvIGhhdmUgYSB2YWx1ZSBvZiBhIG1pbmltdW0gbGVuZ3RoLlxuICAgKi9cbiAgc3RhdGljIG1pbkxlbmd0aChtaW5MZW5ndGg6IG51bWJlcik6IFZhbGlkYXRvckZuIHtcbiAgICByZXR1cm4gKGNvbnRyb2w6IG1vZGVsTW9kdWxlLkFic3RyYWN0Q29udHJvbCk6IHtba2V5OiBzdHJpbmddOiBhbnl9ID0+IHtcbiAgICAgIGlmIChpc1ByZXNlbnQoVmFsaWRhdG9ycy5yZXF1aXJlZChjb250cm9sKSkpIHJldHVybiBudWxsO1xuICAgICAgdmFyIHY6IHN0cmluZyA9IGNvbnRyb2wudmFsdWU7XG4gICAgICByZXR1cm4gdi5sZW5ndGggPCBtaW5MZW5ndGggP1xuICAgICAgICAgICAgICAgICB7XCJtaW5sZW5ndGhcIjoge1wicmVxdWlyZWRMZW5ndGhcIjogbWluTGVuZ3RoLCBcImFjdHVhbExlbmd0aFwiOiB2Lmxlbmd0aH19IDpcbiAgICAgICAgICAgICAgICAgbnVsbDtcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIFZhbGlkYXRvciB0aGF0IHJlcXVpcmVzIGNvbnRyb2xzIHRvIGhhdmUgYSB2YWx1ZSBvZiBhIG1heGltdW0gbGVuZ3RoLlxuICAgKi9cbiAgc3RhdGljIG1heExlbmd0aChtYXhMZW5ndGg6IG51bWJlcik6IFZhbGlkYXRvckZuIHtcbiAgICByZXR1cm4gKGNvbnRyb2w6IG1vZGVsTW9kdWxlLkFic3RyYWN0Q29udHJvbCk6IHtba2V5OiBzdHJpbmddOiBhbnl9ID0+IHtcbiAgICAgIGlmIChpc1ByZXNlbnQoVmFsaWRhdG9ycy5yZXF1aXJlZChjb250cm9sKSkpIHJldHVybiBudWxsO1xuICAgICAgdmFyIHY6IHN0cmluZyA9IGNvbnRyb2wudmFsdWU7XG4gICAgICByZXR1cm4gdi5sZW5ndGggPiBtYXhMZW5ndGggP1xuICAgICAgICAgICAgICAgICB7XCJtYXhsZW5ndGhcIjoge1wicmVxdWlyZWRMZW5ndGhcIjogbWF4TGVuZ3RoLCBcImFjdHVhbExlbmd0aFwiOiB2Lmxlbmd0aH19IDpcbiAgICAgICAgICAgICAgICAgbnVsbDtcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIFZhbGlkYXRvciB0aGF0IHJlcXVpcmVzIGEgY29udHJvbCB0byBtYXRjaCBhIHJlZ2V4IHRvIGl0cyB2YWx1ZS5cbiAgICovXG4gIHN0YXRpYyBwYXR0ZXJuKHBhdHRlcm46IHN0cmluZyk6IFZhbGlkYXRvckZuIHtcbiAgICByZXR1cm4gKGNvbnRyb2w6IG1vZGVsTW9kdWxlLkFic3RyYWN0Q29udHJvbCk6IHtba2V5OiBzdHJpbmddOiBhbnl9ID0+IHtcbiAgICAgIGlmIChpc1ByZXNlbnQoVmFsaWRhdG9ycy5yZXF1aXJlZChjb250cm9sKSkpIHJldHVybiBudWxsO1xuICAgICAgbGV0IHJlZ2V4ID0gbmV3IFJlZ0V4cChgXiR7cGF0dGVybn0kYCk7XG4gICAgICBsZXQgdjogc3RyaW5nID0gY29udHJvbC52YWx1ZTtcbiAgICAgIHJldHVybiByZWdleC50ZXN0KHYpID8gbnVsbCA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcInBhdHRlcm5cIjoge1wicmVxdWlyZWRQYXR0ZXJuXCI6IGBeJHtwYXR0ZXJufSRgLCBcImFjdHVhbFZhbHVlXCI6IHZ9fTtcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIE5vLW9wIHZhbGlkYXRvci5cbiAgICovXG4gIHN0YXRpYyBudWxsVmFsaWRhdG9yKGM6IG1vZGVsTW9kdWxlLkFic3RyYWN0Q29udHJvbCk6IHtba2V5OiBzdHJpbmddOiBib29sZWFufSB7IHJldHVybiBudWxsOyB9XG5cbiAgLyoqXG4gICAqIENvbXBvc2UgbXVsdGlwbGUgdmFsaWRhdG9ycyBpbnRvIGEgc2luZ2xlIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyB0aGUgdW5pb25cbiAgICogb2YgdGhlIGluZGl2aWR1YWwgZXJyb3IgbWFwcy5cbiAgICovXG4gIHN0YXRpYyBjb21wb3NlKHZhbGlkYXRvcnM6IFZhbGlkYXRvckZuW10pOiBWYWxpZGF0b3JGbiB7XG4gICAgaWYgKGlzQmxhbmsodmFsaWRhdG9ycykpIHJldHVybiBudWxsO1xuICAgIHZhciBwcmVzZW50VmFsaWRhdG9ycyA9IHZhbGlkYXRvcnMuZmlsdGVyKGlzUHJlc2VudCk7XG4gICAgaWYgKHByZXNlbnRWYWxpZGF0b3JzLmxlbmd0aCA9PSAwKSByZXR1cm4gbnVsbDtcblxuICAgIHJldHVybiBmdW5jdGlvbihjb250cm9sOiBtb2RlbE1vZHVsZS5BYnN0cmFjdENvbnRyb2wpIHtcbiAgICAgIHJldHVybiBfbWVyZ2VFcnJvcnMoX2V4ZWN1dGVWYWxpZGF0b3JzKGNvbnRyb2wsIHByZXNlbnRWYWxpZGF0b3JzKSk7XG4gICAgfTtcbiAgfVxuXG4gIHN0YXRpYyBjb21wb3NlQXN5bmModmFsaWRhdG9yczogQXN5bmNWYWxpZGF0b3JGbltdKTogQXN5bmNWYWxpZGF0b3JGbiB7XG4gICAgaWYgKGlzQmxhbmsodmFsaWRhdG9ycykpIHJldHVybiBudWxsO1xuICAgIHZhciBwcmVzZW50VmFsaWRhdG9ycyA9IHZhbGlkYXRvcnMuZmlsdGVyKGlzUHJlc2VudCk7XG4gICAgaWYgKHByZXNlbnRWYWxpZGF0b3JzLmxlbmd0aCA9PSAwKSByZXR1cm4gbnVsbDtcblxuICAgIHJldHVybiBmdW5jdGlvbihjb250cm9sOiBtb2RlbE1vZHVsZS5BYnN0cmFjdENvbnRyb2wpIHtcbiAgICAgIGxldCBwcm9taXNlcyA9IF9leGVjdXRlQXN5bmNWYWxpZGF0b3JzKGNvbnRyb2wsIHByZXNlbnRWYWxpZGF0b3JzKS5tYXAoX2NvbnZlcnRUb1Byb21pc2UpO1xuICAgICAgcmV0dXJuIFByb21pc2VXcmFwcGVyLmFsbChwcm9taXNlcykudGhlbihfbWVyZ2VFcnJvcnMpO1xuICAgIH07XG4gIH1cbn1cblxuZnVuY3Rpb24gX2NvbnZlcnRUb1Byb21pc2Uob2JqOiBhbnkpOiBhbnkge1xuICByZXR1cm4gUHJvbWlzZVdyYXBwZXIuaXNQcm9taXNlKG9iaikgPyBvYmogOiBPYnNlcnZhYmxlV3JhcHBlci50b1Byb21pc2Uob2JqKTtcbn1cblxuZnVuY3Rpb24gX2V4ZWN1dGVWYWxpZGF0b3JzKGNvbnRyb2w6IG1vZGVsTW9kdWxlLkFic3RyYWN0Q29udHJvbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWxpZGF0b3JzOiBWYWxpZGF0b3JGbltdKTogYW55W10ge1xuICByZXR1cm4gdmFsaWRhdG9ycy5tYXAodiA9PiB2KGNvbnRyb2wpKTtcbn1cblxuZnVuY3Rpb24gX2V4ZWN1dGVBc3luY1ZhbGlkYXRvcnMoY29udHJvbDogbW9kZWxNb2R1bGUuQWJzdHJhY3RDb250cm9sLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsaWRhdG9yczogQXN5bmNWYWxpZGF0b3JGbltdKTogYW55W10ge1xuICByZXR1cm4gdmFsaWRhdG9ycy5tYXAodiA9PiB2KGNvbnRyb2wpKTtcbn1cblxuZnVuY3Rpb24gX21lcmdlRXJyb3JzKGFycmF5T2ZFcnJvcnM6IGFueVtdKToge1trZXk6IHN0cmluZ106IGFueX0ge1xuICB2YXIgcmVzOiB7W2tleTogc3RyaW5nXTogYW55fSA9XG4gICAgICBhcnJheU9mRXJyb3JzLnJlZHVjZSgocmVzOiB7W2tleTogc3RyaW5nXTogYW55fSwgZXJyb3JzOiB7W2tleTogc3RyaW5nXTogYW55fSkgPT4ge1xuICAgICAgICByZXR1cm4gaXNQcmVzZW50KGVycm9ycykgPyBTdHJpbmdNYXBXcmFwcGVyLm1lcmdlKHJlcywgZXJyb3JzKSA6IHJlcztcbiAgICAgIH0sIHt9KTtcbiAgcmV0dXJuIFN0cmluZ01hcFdyYXBwZXIuaXNFbXB0eShyZXMpID8gbnVsbCA6IHJlcztcbn1cbiJdfQ==