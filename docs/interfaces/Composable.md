[dvori](../README.md) / [Exports](../modules.md) / Composable

# Interface: Composable

## Table of contents

### Properties

- [afterResponse](Composable.md#afterresponse)
- [beforeRequest](Composable.md#beforerequest)
- [finalize](Composable.md#finalize)
- [onError](Composable.md#onerror)

## Properties

### afterResponse

• `Optional` **afterResponse**: (`response`: `Response`) => `Response` \| `Promise`\<`Response`\>

#### Type declaration

▸ (`response`): `Response` \| `Promise`\<`Response`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `response` | `Response` |

##### Returns

`Response` \| `Promise`\<`Response`\>

#### Defined in

[src/types/index.ts:24](https://github.com/dvorijs/dvori/blob/f967545/src/types/index.ts#L24)

___

### beforeRequest

• `Optional` **beforeRequest**: (`config`: [`RequestConfig`](RequestConfig.md)) => [`RequestConfig`](RequestConfig.md) \| `Promise`\<[`RequestConfig`](RequestConfig.md)\>

#### Type declaration

▸ (`config`): [`RequestConfig`](RequestConfig.md) \| `Promise`\<[`RequestConfig`](RequestConfig.md)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `config` | [`RequestConfig`](RequestConfig.md) |

##### Returns

[`RequestConfig`](RequestConfig.md) \| `Promise`\<[`RequestConfig`](RequestConfig.md)\>

#### Defined in

[src/types/index.ts:21](https://github.com/dvorijs/dvori/blob/f967545/src/types/index.ts#L21)

___

### finalize

• `Optional` **finalize**: () => `void`

#### Type declaration

▸ (): `void`

##### Returns

`void`

#### Defined in

[src/types/index.ts:26](https://github.com/dvorijs/dvori/blob/f967545/src/types/index.ts#L26)

___

### onError

• `Optional` **onError**: (`error`: `any`) => `any`

#### Type declaration

▸ (`error`): `any`

##### Parameters

| Name | Type |
| :------ | :------ |
| `error` | `any` |

##### Returns

`any`

#### Defined in

[src/types/index.ts:25](https://github.com/dvorijs/dvori/blob/f967545/src/types/index.ts#L25)
