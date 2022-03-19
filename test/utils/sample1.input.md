## Interfaces


<a name="interfacesdev_utilsgitinfomd"></a>

[@handy-common-utils/dev-utils](#readmemd) / [dev-utils](../modules/dev_utils.md) / GitInfo

### Interface: GitInfo

[dev-utils](../modules/dev_utils.md).GitInfo

Git related information. See https://github.com/jacob-meacham/serverless-plugin-git-variables


##### Properties

- [branch](#branch)
- [commitIdLong](#commitidlong)
- [commitIdShort](#commitidshort)
- [describe](#describe)
- [describeLight](#describelight)
- [email](#email)
- [isDirty](#isdirty)
- [message](#message)
- [messageBody](#messagebody)
- [messageSubject](#messagesubject)
- [repository](#repository)
- [tag](#tag)
- [tags](#tags)
- [user](#user)

#### Properties

##### branch

• **branch**: `string`

name of the current branch

___

##### commitIdLong

• **commitIdLong**: `string`

hash of the current commit, a.k.a. commit ID, in full

___

##### commitIdShort

• **commitIdShort**: `string`

hash of the current commit, a.k.a. commit ID, in short format

___

##### describe

• **describe**: `string`

the most recent tag of the repo, evaluates to `git describe --always`

___

##### describeLight

• **describeLight**: `string`

the most recent tag of the repo, evaluates to `git describe --always --tags`

___

##### email

• **email**: `string`

current Git user's email as configured by `git config user.email ...`

___

##### isDirty

• **isDirty**: `boolean`

true if the workspace is currently dirty

___

##### message

• **message**: `string`

full git commit message

___

##### messageBody

• **messageBody**: `string`

body of the commit message, as `git log -1 --pretty=%b`

___

##### messageSubject

• **messageSubject**: `string`

suject of the commit message, as `git log -1 --pretty=%s`

___

##### repository

• **repository**: `string`

name of the git repository

___

##### tag

• **tag**: `string`

First tag on the current commit, or sha1/ID of the commit if there's no tag

___

##### tags

• **tags**: `string`[]

tags on the current commit, or sha1/ID of the commit if there's no tag

___

##### user

• **user**: `string`

current Git user's name as configured by `git config user.name ...`