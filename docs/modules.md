[dvori](README.md) / Exports

# dvori

## Table of contents

### Enumerations

- [Environment](enums/Environment.md)

### Interfaces

- [ClientConfig](interfaces/ClientConfig.md)
- [Composable](interfaces/Composable.md)
- [LifecycleGroups](interfaces/LifecycleGroups.md)
- [RequestConfig](interfaces/RequestConfig.md)

### Type Aliases

- [ComposableKey](modules.md#composablekey)
- [LifecycleKey](modules.md#lifecyclekey)
- [ResponseReturnType](modules.md#responsereturntype)
- [StreamedResponse](modules.md#streamedresponse)
- [VerbMethodOptions](modules.md#verbmethodoptions)

## Type Aliases

### ComposableKey

Ƭ **ComposableKey**: keyof [`Composable`](interfaces/Composable.md)

#### Defined in

[src/types/index.ts:49](https://github.com/dvorijs/dvori/blob/f967545/src/types/index.ts#L49)

___

### LifecycleKey

Ƭ **LifecycleKey**: keyof [`LifecycleGroups`](interfaces/LifecycleGroups.md)

#### Defined in

[src/types/index.ts:50](https://github.com/dvorijs/dvori/blob/f967545/src/types/index.ts#L50)

___

### ResponseReturnType

Ƭ **ResponseReturnType**\<`T`\>: `Response` \| [`StreamedResponse`](modules.md#streamedresponse) \| `ArrayBuffer` \| `Blob` \| `string` \| `T`

#### Type parameters

| Name |
| :------ |
| `T` |

#### Defined in

[src/types/index.ts:57](https://github.com/dvorijs/dvori/blob/f967545/src/types/index.ts#L57)

___

### StreamedResponse

Ƭ **StreamedResponse**: `ReadableStream`\<`Uint8Array`\> \| ``null``

#### Defined in

[src/types/index.ts:54](https://github.com/dvorijs/dvori/blob/f967545/src/types/index.ts#L54)

___

### VerbMethodOptions

Ƭ **VerbMethodOptions**: `Omit`\<[`RequestConfig`](interfaces/RequestConfig.md), ``"url"``\>

#### Defined in

[src/types/index.ts:51](https://github.com/dvorijs/dvori/blob/f967545/src/types/index.ts#L51)
