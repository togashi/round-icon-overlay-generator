# round-icon-overlay-generator

Generate overlay image for launcher round icon of android apps.

## installation

```shell
> npm install togashi/round-icon-overlay-generator
```

## usage

```shell
> round-icon-overlay --flavor develop --output overlay.png
```

and use with plugins like [gradle-android-ribbonizer-plugin](https://github.com/akaita/easylauncher-gradle-plugin)

```groovy
easylauncher {
    iconNames "@mipmap/ic_launcher"
    productFlavors {
        dev {
            filters = overlayFilter(new File('overlay.png'))
        }
        prod {}
    }
}
```
