[dvori](../README.md) / [Exports](../modules.md) / ClientConfig

# Interface: ClientConfig

## Hierarchy

- `RequestInit`

  ↳ **`ClientConfig`**

## Table of contents

### Properties

- [baseURL](ClientConfig.md#baseurl)
- [body](ClientConfig.md#body)
- [cache](ClientConfig.md#cache)
- [composables](ClientConfig.md#composables)
- [credentials](ClientConfig.md#credentials)
- [headers](ClientConfig.md#headers)
- [integrity](ClientConfig.md#integrity)
- [keepalive](ClientConfig.md#keepalive)
- [method](ClientConfig.md#method)
- [mode](ClientConfig.md#mode)
- [onDownloadProgress](ClientConfig.md#ondownloadprogress)
- [onUploadProgress](ClientConfig.md#onuploadprogress)
- [params](ClientConfig.md#params)
- [parseResponse](ClientConfig.md#parseresponse)
- [redirect](ClientConfig.md#redirect)
- [referrer](ClientConfig.md#referrer)
- [referrerPolicy](ClientConfig.md#referrerpolicy)
- [signal](ClientConfig.md#signal)
- [stream](ClientConfig.md#stream)
- [timeout](ClientConfig.md#timeout)
- [window](ClientConfig.md#window)

## Properties

### baseURL

• `Optional` **baseURL**: `string`

#### Defined in

[src/types/index.ts:3](https://github.com/dvorijs/dvori/blob/f967545/src/types/index.ts#L3)

___

### body

• `Optional` **body**: ``null`` \| `BodyInit`

A BodyInit object or null to set request's body.

#### Inherited from

RequestInit.body

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:1676

___

### cache

• `Optional` **cache**: `RequestCache`

A string indicating how the request will interact with the browser's cache to set request's cache.

#### Inherited from

RequestInit.cache

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:1678

___

### composables

• `Optional` **composables**: [`Composable`](Composable.md)[]

#### Defined in

[src/types/index.ts:7](https://github.com/dvorijs/dvori/blob/f967545/src/types/index.ts#L7)

___

### credentials

• `Optional` **credentials**: `RequestCredentials`

A string indicating whether credentials will be sent with the request always, never, or only when sent to a same-origin URL. Sets request's credentials.

#### Inherited from

RequestInit.credentials

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:1680

___

### headers

• `Optional` **headers**: `HeadersInit`

A Headers object, an object literal, or an array of two-item arrays to set request's headers.

#### Inherited from

RequestInit.headers

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:1682

___

### integrity

• `Optional` **integrity**: `string`

A cryptographic hash of the resource to be fetched by request. Sets request's integrity.

#### Inherited from

RequestInit.integrity

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:1684

___

### keepalive

• `Optional` **keepalive**: `boolean`

A boolean to set request's keepalive.

#### Inherited from

RequestInit.keepalive

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:1686

___

### method

• `Optional` **method**: `string`

A string to set request's method.

#### Inherited from

RequestInit.method

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:1688

___

### mode

• `Optional` **mode**: `RequestMode`

A string to indicate whether the request will use CORS, or will be restricted to same-origin URLs. Sets request's mode.

#### Inherited from

RequestInit.mode

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:1690

___

### onDownloadProgress

• `Optional` **onDownloadProgress**: (`progressEvent`: `ProgressEvent`\<`EventTarget`\>) => `void`

#### Type declaration

▸ (`progressEvent`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `progressEvent` | `ProgressEvent`\<`EventTarget`\> |

##### Returns

`void`

#### Defined in

[src/types/index.ts:12](https://github.com/dvorijs/dvori/blob/f967545/src/types/index.ts#L12)

___

### onUploadProgress

• `Optional` **onUploadProgress**: (`progressEvent`: `ProgressEvent`\<`EventTarget`\>) => `void`

#### Type declaration

▸ (`progressEvent`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `progressEvent` | `ProgressEvent`\<`EventTarget`\> |

##### Returns

`void`

#### Defined in

[src/types/index.ts:11](https://github.com/dvorijs/dvori/blob/f967545/src/types/index.ts#L11)

___

### params

• `Optional` **params**: `Record`\<`string`, `string` \| `number`\>

#### Defined in

[src/types/index.ts:4](https://github.com/dvorijs/dvori/blob/f967545/src/types/index.ts#L4)

___

### parseResponse

• `Optional` **parseResponse**: `boolean`

#### Defined in

[src/types/index.ts:6](https://github.com/dvorijs/dvori/blob/f967545/src/types/index.ts#L6)

___

### redirect

• `Optional` **redirect**: `RequestRedirect`

A string indicating whether request follows redirects, results in an error upon encountering a redirect, or returns the redirect (in an opaque fashion). Sets request's redirect.

#### Inherited from

RequestInit.redirect

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:1692

___

### referrer

• `Optional` **referrer**: `string`

A string whose value is a same-origin URL, "about:client", or the empty string, to set request's referrer.

#### Inherited from

RequestInit.referrer

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:1694

___

### referrerPolicy

• `Optional` **referrerPolicy**: `ReferrerPolicy`

A referrer policy to set request's referrerPolicy.

#### Inherited from

RequestInit.referrerPolicy

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:1696

___

### signal

• `Optional` **signal**: `AbortSignal`

#### Overrides

RequestInit.signal

#### Defined in

[src/types/index.ts:9](https://github.com/dvorijs/dvori/blob/f967545/src/types/index.ts#L9)

___

### stream

• `Optional` **stream**: `boolean`

#### Defined in

[src/types/index.ts:5](https://github.com/dvorijs/dvori/blob/f967545/src/types/index.ts#L5)

___

### timeout

• `Optional` **timeout**: `number`

#### Defined in

[src/types/index.ts:8](https://github.com/dvorijs/dvori/blob/f967545/src/types/index.ts#L8)

___

### window

• `Optional` **window**: ``null``

Can only be null. Used to disassociate request from any Window.

#### Inherited from

RequestInit.window

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:1700
