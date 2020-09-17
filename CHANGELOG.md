# Change Log

## [1.2.0] - 2020-08-25
ADDED:

select: (object, path, defaultValue) => value at path || defaultValue
#####
select({a: 1}, ['a']) // 1
#####
select({a: 1}, ['b']) // undefined
#####
select({a: 1}, ['b'], null) // null
#####
select({a: 1}, ['a'], null) // 1


## [1.1.0] - 2020-08-25

You can still use it as before, by using "named" import of immute
####
import { immute } from 'ngrx-immutable';
####
Since now new, default export is available:
####
import immute from 'ngrx-immutable'

Only difference between those two is how you handle "delete" operation.
While for former one you need to pas "undefined" as a value of deleted key,
for latter one you neeed to import DELETE symbol from "ngrx-immutable" and pass it explicitly.
###
import immute, { DELETE } from 'ngrx-immutable';
####
immute(store, ['x', 'y', 'z'], DELETE);
#### in that case value can not be undefined, and the error will be thrown if it is.

## [1.0.6]
Compiled as ES5 module
