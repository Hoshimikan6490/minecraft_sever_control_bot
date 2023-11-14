# Minecraft Server Control Discord BOT

## 概要

このプログラムは、Minecraft サーバーを Discord の BOT 上から実行できるようにするためのものです。

## 注意事項

- この BOT は未完成です。使用する場合は完全にご自身の責任で使用してください。
- この BOT は、の操作出来るユーザーは、自動的にマイクラサーバーの全権限を所有する事になりますので、権限の管理はご注意下さい。
- マイクラサーバーを起動する際に、ファイアウォールの設定や許可等が求められる場合は許可を選択してください。

---

## 使い方
### セットアップ
1. `git clone https://github.com/Hoshimikan6490/minecraft_sever_control_bot.git`を実行する。
2. `npm i`を実行する。
3. 「.env」という名前のファイル(カギ括弧は不要)を作成し、その中に「.env-example」の中身をコピペする。
4. 「.env」にコピペした内容の内、「PLEASE_REPLACE_TO_YOUR_BOT_TOKEN」の部分をあなたが使用する Discord BOT の Token に書き換える。  
   ※詳しい取得方法等は、ご自身でお調べください。万が一分からない場合は、本 repository の issue や<u>[サポートサーバー](https://discord.gg/uYYaVRuUuJ)</u>にてお尋ねください。
5. `config.json`の中身を設定する

```json
  "controllable_user_IDs": [""],
  　　↑マイクラサーバーを操作できるユーザーのDiscordユーザーIDを配列の形で入力してください。
  "BE_server": true,
  　　↑Java版のサーバーの場合はfalse。統合版のサーバーの場合はtrueに設定してください。
  "prefix": "McControl$",
  　　↑起動コマンド等のコマンドの前につけるキーワードを設定してください。デフォルトのままだと、「McControl$start」で起動などです。
  "console_channel_ID": "",
  　　↑このBOTのコマンドを打ったり、マイクラサーバーのログが流れるチャンネルのチャンネルIDを指定してください。
```

設定後の内容例は次の通りです。

```json
{
  "controllable_user_IDs": ["728495196303523900"],
  "BE_server": true,
  "prefix": "McControl$",
  "console_channel_ID": "1160762387230638151"
}
```

6. 最後に、マイクラサーバーのデータを「minecraft_server_data」フォルダ内に格納する。

- Java 版の場合
  1. 任意のバージョンのサーバーファイル（.jar 形式）をダウンロードする。
  2. <ファイル名>.jar を「minecraft_server_data」に移動させる。
  3. 同フォルダ内に「run.bat」というファイルを作成し、メモ帳で開き、以下の内容をコピペする。ただし、「<ファイル名>」の部分は、手順２で移動させたサーバーファイルの名前を使用すること。 
  ```bat
  @echo off
  java -Xmx1024M -Xms1024M -jar <ファイル名>.jar nogui
  pause
  ``` 
  4. 「run.bat」を保存してメモ帳を閉じ、エクスプローラーから「run.bat」ダブルクリックして起動する。
  5. ログが止まったら黒い画面を閉じ、エクスプローラー内に新しく追加された「eula.txt」を開き、内容に同意できる場合は`eula=false`を`eula=true`に書き換えてください。同意できない場合は、サーバーを立てることが出来ません。
  6. これで準備は完了です。お疲れ様でした。実際に使う方法は、次のセクションの「BOTを使う」をご覧ください。
- 統合版の場合
  1. サーバーファイル(.exe 形式)を[公式サイト](https://www.minecraft.net/ja-jp/download/server/bedrock)から、あなたのデバイスにあったものをダウンロードする。
  2. ダウンロードされたzipファイルの<a style="color: magenta;">中身を</a>「minecraft_server_data」フォルダに格納する。
  3. これで準備は完了です。お疲れ様でした。実際に使う方法は、次のセクションの「BOTを使う」をご覧ください。


### BOTを使う