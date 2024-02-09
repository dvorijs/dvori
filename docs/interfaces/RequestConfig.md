[dvori](../README.md) / [Exports](../modules.md) / RequestConfig

# Interface: RequestConfig

## Hierarchy

- `Omit`\<[`ClientConfig`](ClientConfig.md), ``"composables | stream"``\>

  ↳ **`RequestConfig`**

## Table of contents

### Properties

- [baseURL](RequestConfig.md#baseurl)
- [body](RequestConfig.md#body)
- [cache](RequestConfig.md#cache)
- [composables](RequestConfig.md#composables)
- [credentials](RequestConfig.md#credentials)
- [headers](RequestConfig.md#headers)
- [integrity](RequestConfig.md#integrity)
- [keepalive](RequestConfig.md#keepalive)
- [method](RequestConfig.md#method)
- [mode](RequestConfig.md#mode)
- [onDownloadProgress](RequestConfig.md#ondownloadprogress)
- [onUploadProgress](RequestConfig.md#onuploadprogress)
- [params](RequestConfig.md#params)
- [parseResponse](RequestConfig.md#parseresponse)
- [redirect](RequestConfig.md#redirect)
- [referrer](RequestConfig.md#referrer)
- [referrerPolicy](RequestConfig.md#referrerpolicy)
- [signal](RequestConfig.md#signal)
- [stream](RequestConfig.md#stream)
- [timeout](RequestConfig.md#timeout)
- [url](RequestConfig.md#url)
- [window](RequestConfig.md#window)

## Properties

### baseURL

• `Optional` **baseURL**: `string`

#### Inherited from

Omit.baseURL

#### Defined in

[src/types/index.ts:3](https://github.com/dvorijs/dvori/blob/f967545/src/types/index.ts#L3)

___

### body

• `Optional` **body**: ``null`` \| `BodyInit`

A BodyInit object or null to set request's body.

#### Inherited from

Omit.body

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:1676

___

### cache

• `Optional` **cache**: `RequestCache`

A string indicating how the request will interact with the browser's cache to set request's cache.

#### Inherited from

Omit.cache

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:1678

___

### composables

• `Optional` **composables**: [`Composable`](Composable.md)[]

#### Inherited from

Omit.composables

#### Defined in

[src/types/index.ts:7](https://github.com/dvorijs/dvori/blob/f967545/src/types/index.ts#L7)

___

### credentials

• `Optional` **credentials**: `RequestCredentials`

A string indicating whether credentials will be sent with the request always, never, or only when sent to a same-origin URL. Sets request's credentials.

#### Inherited from

Omit.credentials

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:1680

___

### headers

• `Optional` **headers**: `HeadersInit`

A Headers object, an object literal, or an array of two-item arrays to set request's headers.

#### Inherited from

Omit.headers

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:1682

___

### integrity

• `Optional` **integrity**: `string`

A cryptographic hash of the resource to be fetched by request. Sets request's integrity.

#### Inherited from

Omit.integrity

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:1684

___

### keepalive

• `Optional` **keepalive**: `boolean`

A boolean to set request's keepalive.

#### Inherited from

Omit.keepalive

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:1686

___

### method

• `Optional` **method**: `string`

A string to set request's method.

#### Inherited from

Omit.method

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:1688

___

### mode

• `Optional` **mode**: `RequestMode`

A string to indicate whether the request will use CORS, or will be restricted to same-origin URLs. Sets request's mode.

#### Inherited from

Omit.mode

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

#### Inherited from

Omit.onDownloadProgress

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

#### Inherited from

Omit.onUploadProgress

#### Defined in

[src/types/index.ts:11](https://github.com/dvorijs/dvori/blob/f967545/src/types/index.ts#L11)

___

### params

• `Optional` **params**: `Record`\<`string`, `string` \| `number`\>

#### Inherited from

Omit.params

#### Defined in

[src/types/index.ts:4](https://github.com/dvorijs/dvori/blob/f967545/src/types/index.ts#L4)

___

### parseResponse

• `Optional` **parseResponse**: `boolean`

#### Inherited from

Omit.parseResponse

#### Defined in

[src/types/index.ts:6](https://github.com/dvorijs/dvori/blob/f967545/src/types/index.ts#L6)

___

### redirect

• `Optional` **redirect**: `RequestRedirect`

A string indicating whether request follows redirects, results in an error upon encountering a redirect, or returns the redirect (in an opaque fashion). Sets request's redirect.

#### Inherited from

Omit.redirect

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:1692

___

### referrer

• `Optional` **referrer**: `string`

A string whose value is a same-origin URL, "about:client", or the empty string, to set request's referrer.

#### Inherited from

Omit.referrer

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:1694

___

### referrerPolicy

• `Optional` **referrerPolicy**: `ReferrerPolicy`

A referrer policy to set request's referrerPolicy.

#### Inherited from

Omit.referrerPolicy

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:1696

___

### signal

• `Optional` **signal**: `AbortSignal`

#### Inherited from

Omit.signal

#### Defined in

[src/types/index.ts:9](https://github.com/dvorijs/dvori/blob/f967545/src/types/index.ts#L9)

___

### stream

• `Optional` **stream**: `boolean`

#### Inherited from

Omit.stream

#### Defined in

[src/types/index.ts:5](https://github.com/dvorijs/dvori/blob/f967545/src/types/index.ts#L5)

___

### timeout

• `Optional` **timeout**: `number`

#### Inherited from

Omit.timeout

#### Defined in

[src/types/index.ts:8](https://github.com/dvorijs/dvori/blob/f967545/src/types/index.ts#L8)

___

### url

• **url**: `string`

#### Defined in

[src/types/index.ts:17](https://github.com/dvorijs/dvori/blob/f967545/src/types/index.ts#L17)

___

### window

• `Optional` **window**: ``null``

Can only be null. Used to disassociate request from any Window.

#### Inherited from

Omit.window

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:1700
