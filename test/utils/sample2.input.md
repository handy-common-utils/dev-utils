### Class: CliConsole<DEBUG_FUNC, INFO_FUNC, WARN_FUNC, ERROR_FUNC\>

[cli-console](#modulescli_consolemd).CliConsole

Encapsulation of console output functions.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `DEBUG_FUNC` | extends `Function` |
| `INFO_FUNC` | extends `Function` |
| `WARN_FUNC` | extends `Function` |
| `ERROR_FUNC` | extends `Function` |

#### Table of contents

##### Constructors

- [constructor](#constructor)

##### Properties

- [debug](#debug)
- [error](#error)
- [info](#info)
- [isDebug](#isdebug)
- [isQuiet](#isquiet)
- [warn](#warn)
- [NO\_OP\_FUNC](#no_op_func)

##### Methods

- [default](#default)
- [withColour](#withcolour)

#### Constructors

##### constructor

• **new CliConsole**<`DEBUG_FUNC`, `INFO_FUNC`, `WARN_FUNC`, `ERROR_FUNC`\>(`debugFunction`, `infoFunction`, `warnFunction`, `errorFunction`, `isDebug?`, `isQuiet?`)

Constructor

###### Type parameters

| Name | Type |
| :------ | :------ |
| `DEBUG_FUNC` | extends `Function` |
| `INFO_FUNC` | extends `Function` |
| `WARN_FUNC` | extends `Function` |
| `ERROR_FUNC` | extends `Function` |

###### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `debugFunction` | `DEBUG_FUNC` | `undefined` | function for outputting debug information |
| `infoFunction` | `INFO_FUNC` | `undefined` | function for outputting info information |
| `warnFunction` | `WARN_FUNC` | `undefined` | function for outputting warn information |
| `errorFunction` | `ERROR_FUNC` | `undefined` | function for outputting error information |
| `isDebug` | `boolean` | `false` | is debug output enabled or not |
| `isQuiet` | `boolean` | `false` | is quiet mode enabled or not. When quiet mode is enabled, debug and info output would be discarded. |

#### Properties

##### debug

• **debug**: `DEBUG_FUNC`

___

##### error

• **error**: `ERROR_FUNC`

___

##### info

• **info**: `INFO_FUNC`

___

##### isDebug

• **isDebug**: `boolean` = `false`

___

##### isQuiet

• **isQuiet**: `boolean` = `false`

___

##### warn

• **warn**: `WARN_FUNC`

___

##### NO\_OP\_FUNC

▪ `Static` `Protected` **NO\_OP\_FUNC**: () => `void`

###### Type declaration

▸ (): `void`

####### Returns

`void`

#### Methods

##### default

▸ `Static` **default**<`FLAGS`\>(`flags`, `debugFlagName?`, `quietFlagName?`): [`CliConsole`](#classescli_consolecliconsolemd)<`fn`, `fn`, `fn`, `fn`\>

Build an instance with console.log/info/warn/error.