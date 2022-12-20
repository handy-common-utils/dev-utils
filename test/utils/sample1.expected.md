## Interfaces


<a name="interfacesdev_utilsgitinfomd"></a>

[@handy-common-utils/dev-utils](#readmemd) / [dev-utils](../modules/dev_utils.md) / GitInfo

### Interface: GitInfo

[dev-utils](../modules/dev_utils.md).GitInfo

Git related information. See https://github.com/jacob-meacham/serverless-plugin-git-variables


#### Properties

| Property | Description |
| --- | --- |
| **branch**: `string` | name of the current branch |
| **commitIdLong**: `string` | hash of the current commit, a.k.a. commit ID, in full |
| **commitIdShort**: `string` | hash of the current commit, a.k.a. commit ID, in short format |
| **describe**: `string` | the most recent tag of the repo, evaluates to `git describe --always` |
| **describeLight**: `string` | the most recent tag of the repo, evaluates to `git describe --always --tags` |
| **email**: `string` | current Git user's email as configured by `git config user.email ...` |
| **isDirty**: `boolean` | true if the workspace is currently dirty |
| **message**: `string` | full git commit message |
| **messageBody**: `string` | body of the commit message, as `git log -1 --pretty=%b` |
| **messageSubject**: `string` | suject of the commit message, as `git log -1 --pretty=%s` |
| **repository**: `string` | name of the git repository |
| **tag**: `string` | First tag on the current commit, or sha1/ID of the commit if there's no tag |
| **tags**: `string`[] | tags on the current commit, or sha1/ID of the commit if there's no tag |
| **user**: `string` | current Git user's name as configured by `git config user.name ...` |

