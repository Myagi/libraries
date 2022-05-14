# Myagi Library Repository

This repository has several libraries that were customized for the frontend side of Myagi's Desktop platform.

For simplicity's sake, all packages used are within their same named branches and a release generated from tagged with the branch name.

To use this libraries just reference it in the package.json --> peerDependencies section with the following syntax:

```
"<package_name>": "github:Myagi/libraries#<ReleaseTag>
```

Example:
```
"peerDependencies": {
    "fraql": "github:Myagi/libraries#fraql",
    "react-native-indicators": "github:Myagi/libraries#react-native-indicators",
    "react-native-link-preview": "github:Myagi/libraries#react-native-link-preview",
  }
}
```

Test:

You can check if a package can be referenced in the package.json file, by trying to manually download the package yourself. The download link structure is the following:

```
https://codeload.github.com/Myagi/libraries/tar.gz/<TagName>
```
for example https://codeload.github.com/Myagi/libraries/tar.gz/fraql

