# Images API for Cloudflare Worker
# 基于Cloudflare Worker的 图片引擎

## 项目简介

利用Cloudflare Worker和Bing Daily Images接口实现随机或者获取指定序列的图片

### 支持接口

| 支持接口           | 数量 | 路径       | 描述                  |
| ------------------ | ---- |----------|---------------------|
| Bing Daily Picture | 7    | /bingimg | 必应每日图片，由Bing CN官方提供 |
| Genshin Impact API | 330  | /genshin | 原神官方和同人图，由Pikachu提供 |
| Mac Desktop Images | /    | /macview | macOS内置桌面壁纸，风景类型壁纸  |
| Mac Desktop Images | /    | /macbase | macOS内置桌面壁纸，经典类型壁纸  |


## 使用方法

### 接口地址

```
https://images.524228.xyz/[<>|<genshin>|<bingimg>]?random=0|1&number=0|..&images=0|1|2
```

### 接口说明

| 参数   | 类型 | 含义                                                |                             描述                             |
| ------ | ---- | --------------------------------------------------- | :----------------------------------------------------------: |
| random | int  | 0-固定，1-随机                                      |   是否随机返回图片，当设置为`1`时，`number`参数将会被忽略    |
| number | int  | 0~XXXX，图片ID                                      |    指定返回图片编号，由于图片数量有上限，超过上限会取模!     |
| images | int  | 0-直接返回图片<br>1-返回图片地址<br/>2-重定向到图片 | 设置返回图片方式，=`0`或不提供则为直接返回图片本体数据<br/>设置为=`1`会以文本形式返回图片的地址，供进一步处理使用<br/>设置为=`2`会以302*重定向形式直接跳转到图片原始真实地址 |

### 使用示例

#### Bing图片

- 返回Bing今日图片（当天的图片）

  ```
  https://images.524228.xyz/
  https://images.524228.xyz/bingimg
  https://images.524228.xyz/bingimg?number=0
  ```

- 返回Bing随机图片（随机1~10天）

  ```
  https://images.524228.xyz/?random=1
  https://images.524228.xyz/bingimg?random=1
  ```
  
- 返回Bing指定图片（指定第10天）

  ```
  https://images.524228.xyz/?number=10
  https://images.524228.xyz/bingimg?number=10
  ```
- 文本形式返回链接
  ```
  https://images.524228.xyz/?images=1
  https://images.524228.xyz/bingimg?images=1
  
  https://images.524228.xyz/?number=1&images=1
  https://images.524228.xyz/bingimg?number=1&images=1
  
  https://images.524228.xyz/?random=1&images=1
  https://images.524228.xyz/bingimg?random=1&images=1
  ```
  
- 重定向到图片地址
  ```
  https://images.524228.xyz/?images=2
  https://images.524228.xyz/bingimg?images=2
  
  https://images.524228.xyz/?random=1&images=2
  https://images.524228.xyz/bingimg?random=1&images=2
  
  https://images.524228.xyz/?number=10&images=2
  https://images.524228.xyz/bingimg?number=1&images=2
  ```

#### 原神图片 

- 返回原神随机图片（随机抽一张）
  ```
  https://images.524228.xyz/genshin?random=1
  ```

- 返回原神指定图片（指定某一张）

  ```
  https://images.524228.xyz/genshin?number=100
  ```

- 文本形式返回链接

  ```
  https://images.524228.xyz/genshin?images=1
  https://images.524228.xyz/genshin?random=1&images=1
  https://images.524228.xyz/genshin?number=1&images=1
  ```

- 重定向到图片地址
  ```
  https://images.524228.xyz/genshin?images=2
  https://images.524228.xyz/genshin?random=1&images=2
  https://images.524228.xyz/genshin?number=100&images=2
  ```

#### macOS风景

- 返回macOS桌面随机图片（随机抽一张）
  ```
  https://images.524228.xyz/macview?random=1
  ```

- 返回macOS指定图片（指定某一张）

  ```
  https://images.524228.xyz/macview?number=100
  ```

- 文本形式返回macOS桌面图片链接

  ```
  https://images.524228.xyz/macview?images=1
  https://images.524228.xyz/macview?random=1&images=1
  https://images.524228.xyz/macview?number=1&images=1
  ```

- 重定向到macOS图片地址
  ```
  https://images.524228.xyz/macview?images=2
  https://images.524228.xyz/macview?random=1&images=2
  https://images.524228.xyz/macview?number=100&images=2
  ```


## 部署方法

### 克隆工程

```shell
git clone https://github.com/PIKACHUIM/bing-img-api.git
```


### 测试代码
```shell
npm install
npm run dev
```

### 部署云端
```shell
npm run deploy
```
