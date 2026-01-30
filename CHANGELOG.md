# [2.7.0](https://github.com/NewKrok/three-particles-editor/compare/v2.6.0...v2.7.0) (2026-01-30)

### Bug Fixes

- properly reset config when creating new particle system ([a7eb370](https://github.com/NewKrok/three-particles-editor/commit/a7eb3707de42635cce689ff1b981bfd40d3712d0))
- resolve config loading issues and add missing texture ([e439ac3](https://github.com/NewKrok/three-particles-editor/commit/e439ac3b859da85cd7e8941f0262f98fd80c9f28))

### Features

- add burst emission mode support to editor ([f6db818](https://github.com/NewKrok/three-particles-editor/commit/f6db818f522ef1db1bfe540b88c1a62bbbc8c023))
- add individual update method option to helper settings ([98733cd](https://github.com/NewKrok/three-particles-editor/commit/98733cd31990eb8e5f699d37441e13b2c16ced87))
- add Snow Cannon particle effect with detailed snowflake texture ([22e8e9d](https://github.com/NewKrok/three-particles-editor/commit/22e8e9d53c4e50f10bc46b699cdbf1de6b95d549))
- show confirmation dialog only when config has unsaved changes ([e1b0a12](https://github.com/NewKrok/three-particles-editor/commit/e1b0a12680b49c43dec8ef01fad7e86e77fff03b))

# [2.6.0](https://github.com/NewKrok/three-particles-editor/compare/v2.5.0...v2.6.0) (2026-01-25)

### Bug Fixes

- add @semantic-release/npm plugin to update package.json version ([7debc17](https://github.com/NewKrok/three-particles-editor/commit/7debc177c945539e3a1df6a5933906c846950cf6))
- remove duplicate config storage from examples-config.js ([1a16395](https://github.com/NewKrok/three-particles-editor/commit/1a163950f4ac7e828b2338b984c824a5300073f6))
- shape helper now follows transform position values ([5cf480d](https://github.com/NewKrok/three-particles-editor/commit/5cf480d9f54f296f58d19e093637fcd26886501d))

### Features

- add Mystic Portal particle effect example ([b796712](https://github.com/NewKrok/three-particles-editor/commit/b796712a57bdc5955ab03586c37be08dfc6c6839))
- add preview image for Rising Bubbles effect ([fb5e561](https://github.com/NewKrok/three-particles-editor/commit/fb5e56113cf464f5a8a02acf03d7356387874b0a))
- add Show Shape debug helper to visualize emitter shapes ([27ec18b](https://github.com/NewKrok/three-particles-editor/commit/27ec18b70fefa8cc511e2d4d672efd8b88b49048))
- add vortex and bubbles particle textures ([5edc0aa](https://github.com/NewKrok/three-particles-editor/commit/5edc0aa3f5fa80de040a1cdfa614a0d97b96bdf0))
- replace Cauldron Bubbles with Rising Bubbles particle effect ([24bd39f](https://github.com/NewKrok/three-particles-editor/commit/24bd39fcd206c46db651a4a86f25b53f5ebeae21))

# [2.5.0](https://github.com/NewKrok/three-particles-editor/compare/v2.4.0...v2.5.0) (2026-01-24)

### Bug Fixes

- correct bezier editor canvas sizing and alignment ([b98a6b0](https://github.com/NewKrok/three-particles-editor/commit/b98a6b0947db88743a367f4a55e2cf33c54ce655))
- restore right-panel container for lil-gui positioning ([5e30995](https://github.com/NewKrok/three-particles-editor/commit/5e30995c0ec4d8b2f253e76d5b939037b5d2b56e))
- unify gradient editor help panel style with bezier editor ([f572767](https://github.com/NewKrok/three-particles-editor/commit/f5727672d04fe702b283ae321b03d3c0a3eb1f50)), closes [#333](https://github.com/NewKrok/three-particles-editor/issues/333) [#2a2a2a](https://github.com/NewKrok/three-particles-editor/issues/2a2a2a) [#444](https://github.com/NewKrok/three-particles-editor/issues/444) [#4a9eff](https://github.com/NewKrok/three-particles-editor/issues/4a9eff)

### Features

- add download button for all textures in library ([7d759b8](https://github.com/NewKrok/three-particles-editor/commit/7d759b83c6db185d86941ffa55205baa8ce86e11))
- add preview images for particle effect examples ([ec64965](https://github.com/NewKrok/three-particles-editor/commit/ec649659d787462da499daa4f681735764ec10c8))
- add screenshot capture functionality with Shift+S hotkey ([2b57a51](https://github.com/NewKrok/three-particles-editor/commit/2b57a517ebd6f49dc997755375ca954ee59333cc))
- add soft-smoke particle texture ([d7362ca](https://github.com/NewKrok/three-particles-editor/commit/d7362cafeb8a24819718fbc0563d089ce7fe2869))
- add texture selector modal to renderer settings ([d63db50](https://github.com/NewKrok/three-particles-editor/commit/d63db50872e5e9ac5fbcabe9c20901aec74db86a))
- add three new high-quality particle examples using soft-smoke texture ([0ccf5d2](https://github.com/NewKrok/three-particles-editor/commit/0ccf5d2c4e45e8b45740bd3f6976c76dcb069b09)), closes [hi#quality](https://github.com/hi/issues/quality)
- add three new particle textures (light-streak, radial-burst, starburst) ([e7c33b6](https://github.com/NewKrok/three-particles-editor/commit/e7c33b6acd4738d8d34bf6fed53b9f89cd6870bb))
- enable real-time particle system updates in bezier editor ([9821d39](https://github.com/NewKrok/three-particles-editor/commit/9821d3934130e291680c9f4151fc22b029049cd7))
- enhance bezier curve editor with modal interface and expanded presets ([184763b](https://github.com/NewKrok/three-particles-editor/commit/184763bf7df262a25762d0bf4aee6ced636cd04a))
- make entire modal draggable for curve and gradient editors ([23b5c74](https://github.com/NewKrok/three-particles-editor/commit/23b5c748a269c7c9593dd41e01d40c87e6124e5d))
- redesign Arcane Vortex as Arcane Burst effect ([161f0b4](https://github.com/NewKrok/three-particles-editor/commit/161f0b441168672f72c4180f3c55dbeed89f0fbc)), closes [hi#quality](https://github.com/hi/issues/quality)
- replace Celestial Impact with Solar Flare effect ([51741a4](https://github.com/NewKrok/three-particles-editor/commit/51741a4c0e0bbb1c5689474ef33ff3efeff4c508))

# [2.4.0](https://github.com/NewKrok/three-particles-editor/compare/v2.3.0...v2.4.0) (2026-01-22)

### Bug Fixes

- add missing keys to Svelte each blocks ([eb39b96](https://github.com/NewKrok/three-particles-editor/commit/eb39b963bb6a1ffbfdc84fc60df9e1c14c7ef1ec))
- add missing type fields to particle system examples ([18c9188](https://github.com/NewKrok/three-particles-editor/commit/18c91888895beb8e97ca1c6efd36d27d9ce7910d))
- convert CommonJS config files to ES modules for compatibility ([de80d6e](https://github.com/NewKrok/three-particles-editor/commit/de80d6e59f6002b399cdf1c5fcaaeaef2a3db680))
- handle undefined config in example search filter ([02f0305](https://github.com/NewKrok/three-particles-editor/commit/02f0305288ae5969fd463c60330206247697831f))
- improve gradient editor marker positioning and drag constraints ([2537e19](https://github.com/NewKrok/three-particles-editor/commit/2537e19274b6698462c3e80941879ea5f74abf20))
- improve legacy config detection using editorVersion metadata ([3acea59](https://github.com/NewKrok/three-particles-editor/commit/3acea598221db7bbd6b212e532f63c543b7b11c4))
- upgrade Node.js version to 20 in CI workflows ([2bc757c](https://github.com/NewKrok/three-particles-editor/commit/2bc757c0286b977c5655226f59bddd607b5cb5df))
- upgrade Node.js version to 22 for semantic-release compatibility ([81c340a](https://github.com/NewKrok/three-particles-editor/commit/81c340a70f2b2b665c4f65584ab4addc5eb90355))

### Features

- add 12 new gradient presets for diverse visual effects ([854b02e](https://github.com/NewKrok/three-particles-editor/commit/854b02eaec961d81003333e1c2dffc7fb5496b4d))
- add gradient preset management with visual previews ([6d1b5bd](https://github.com/NewKrok/three-particles-editor/commit/6d1b5bd612115004d69d9b002451e4de6e0604ed))
- add Ko-fi support button for project donations ([55130ab](https://github.com/NewKrok/three-particles-editor/commit/55130ab6ac74b9dad7b8b0bc9c85a8daa64cf32c))
- add new Feathers particle effect example ([ddbe8b2](https://github.com/NewKrok/three-particles-editor/commit/ddbe8b2d268671dc1a1bce4216200de8cf903e2a))
- implement color over lifetime with three independent RGB channels ([98b0f19](https://github.com/NewKrok/three-particles-editor/commit/98b0f19ac096eb8e25b6437c94023dcbfca87f48))
- implement unified gradient editor for color and opacity over lifetime ([1952f78](https://github.com/NewKrok/three-particles-editor/commit/1952f78643eea24881f3469fc2b8bb09e44d6b61))
- integrate Google Analytics with dynamic configuration ([0f29e85](https://github.com/NewKrok/three-particles-editor/commit/0f29e85a0bcf5a1ef3365a097da3651109c01f31))

# [2.3.0](https://github.com/NewKrok/three-particles-editor/compare/v2.2.1...v2.3.0) (2025-05-02)

### Features

- add separate Save and Save As buttons to header ([28bc9aa](https://github.com/NewKrok/three-particles-editor/commit/28bc9aa3e39c682b192228866b1ca9fc70604907))
- implement collapsible left sidebar panel ([b2bed46](https://github.com/NewKrok/three-particles-editor/commit/b2bed46cd10a0c1add7591e47c172792d13e0332))
- improve save dialog usability with keyboard support and concise labels ([006fb3a](https://github.com/NewKrok/three-particles-editor/commit/006fb3a8927e5915f4ef14834cc2462cec62391c))
- save left panel collapsed state to localStorage ([af90376](https://github.com/NewKrok/three-particles-editor/commit/af90376c8c7197e5da5916eb5f6e6aec913e3cab))

## [2.2.1](https://github.com/NewKrok/three-particles-editor/compare/v2.2.0...v2.2.1) (2025-05-01)

### Bug Fixes

- update GitHub workflow to replace version placeholders before build ([b95bfba](https://github.com/NewKrok/three-particles-editor/commit/b95bfbaa188b85b39ef39d2f37a9952f3794e36a))

# [2.2.0](https://github.com/NewKrok/three-particles-editor/compare/v2.1.0...v2.2.0) (2025-04-28)

### Features

- add automatic Untitled-X naming for unnamed configurations ([33cadff](https://github.com/NewKrok/three-particles-editor/commit/33cadff208fed5a1d03458ac3400488b154cb27a))
- add delete functionality to config cards with confirmation dialog ([85345a3](https://github.com/NewKrok/three-particles-editor/commit/85345a3b13a5bc5edccfc1d9c83f851f9738d63f))
- add editable configuration name with hover edit icon ([b4c5dcc](https://github.com/NewKrok/three-particles-editor/commit/b4c5dccae32241d9bdfee4bac1106a7b22460119))
- add load dialog component for loading saved configurations ([6fffc78](https://github.com/NewKrok/three-particles-editor/commit/6fffc78dde2b80053e6a23d27f656d476478e0a9))
- enhance configuration metadata and naming system ([33f2e79](https://github.com/NewKrok/three-particles-editor/commit/33f2e799e3ccebcb9f4d8c478df07d49f44e2901))
- improve editable configuration name UX with larger input field ([639e804](https://github.com/NewKrok/three-particles-editor/commit/639e8046ff75fda02bbfc33cf1ee79307188c560))

## [1.0.1](https://github.com/NewKrok/three-particles-editor/compare/v1.0.0...v1.0.1) (2025-04-28)

### Bug Fixes

- improve semantic-release configuration and workflow ([19b30a4](https://github.com/NewKrok/three-particles-editor/commit/19b30a440840eb867c7489802ef5be1251d87db1))

# 1.0.0 (2025-04-24)

### Bug Fixes

- add optional chaining to library.svelte and add transparent texture ([35cc8ff](https://github.com/NewKrok/three-particles-editor/commit/35cc8ffa8fe042a06e48f3a3e669922a17e65ce4))
- changes based on the latest dependency updates ([12fa354](https://github.com/NewKrok/three-particles-editor/commit/12fa35460661e35a09fd46a6574ebcad0202a85d))
- correct LifeTimeCurve and LifetimeCurve type references ([bde71c0](https://github.com/NewKrok/three-particles-editor/commit/bde71c035caadebc02c079d5c4afca6f4743cfbf))
- ensure proper object initialization for @newkrok/three-particles v2.0.2 compatibility ([e7a88bc](https://github.com/NewKrok/three-particles-editor/commit/e7a88bc9df5f7d3f2e74c45bae240cb637c9e840))
- export type checking functions to resolve ESLint errors ([2a1e1ae](https://github.com/NewKrok/three-particles-editor/commit/2a1e1ae5da39feeb5bb288f3c4d21f2611633834))
- implement tab visibility change handling to pause animation ([86591da](https://github.com/NewKrok/three-particles-editor/commit/86591da20d35c918e06884cd30bdfdf2c10effa3))
- **imports:** update import paths to reference TypeScript files ([406db56](https://github.com/NewKrok/three-particles-editor/commit/406db560c44d20ef7636f29354eba38323c6bb64))
- improve opacity and size over lifetime handling in config conversion ([e01a807](https://github.com/NewKrok/three-particles-editor/commit/e01a807fbc2339cb66692a7b60e186e96ae8daa5))
- improve velocityOverLifetime orbital conversion for legacy configs ([11f1131](https://github.com/NewKrok/three-particles-editor/commit/11f1131cc32fa99fa9f04f81353b9da6811e88b3))
- include SMUI theme compilation in build script ([5a829d7](https://github.com/NewKrok/three-particles-editor/commit/5a829d7cd35f9c4c5f17adb210e885127c67ee77))
- preserve original percentage values in bezier points during conversion ([b9de01b](https://github.com/NewKrok/three-particles-editor/commit/b9de01b6c04ae72500877c9111aee4fcdc699829))
- prevent adding startOpacity when not in original config ([de68ba4](https://github.com/NewKrok/three-particles-editor/commit/de68ba4bf7ac8acdf752930c52a8d6fdbd6c602c))
- prevent multiple instances of Three.js being imported ([89e0b6e](https://github.com/NewKrok/three-particles-editor/commit/89e0b6e64e418133820e9bf55c239dbae42fb644))
- projectile movement simulation direction and behavior ([38763b9](https://github.com/NewKrok/three-particles-editor/commit/38763b96d18fe89bd1044ed81b87b50337d28ba8))
- remove npm plugin from semantic-release config ([e27a332](https://github.com/NewKrok/three-particles-editor/commit/e27a3326834c0460a88671d9d7b6742998bcceb6))
- replace legacy Sass API with modern API to resolve deprecation warnings ([236065d](https://github.com/NewKrok/three-particles-editor/commit/236065df55ecadaa51eccb58c75e4d2ff7e31cbe))
- startSpeed conversion for objects with only max property ([d9fe428](https://github.com/NewKrok/three-particles-editor/commit/d9fe428052b0afc2f0cc12912b6cdf269b9b2283))
- textureSheetAnimation.startFrame conversion for objects with only max property ([829a4e6](https://github.com/NewKrok/three-particles-editor/commit/829a4e6527e546c7fa21dfa5641b11347fa8e22f))
- update @newkrok/three-particles import paths and fix bundling issues ([38d5b08](https://github.com/NewKrok/three-particles-editor/commit/38d5b08bc2e564765c120fd73b824291e7fcb906))
- update lifetime curve handling in size and opacity editors ([6cc2036](https://github.com/NewKrok/three-particles-editor/commit/6cc2036347c6aa4a8605dbd1f41663f387f4bf6a))

### Features

- 3 new examples were added ([721301d](https://github.com/NewKrok/three-particles-editor/commit/721301d216f2547c681d4eb748933b418c46d4b2))
- add about modal with project information ([30b3b62](https://github.com/NewKrok/three-particles-editor/commit/30b3b624436583b96f56cf78792088ed1db24774))
- add confirmation dialog for overwriting saved configurations ([cc3f800](https://github.com/NewKrok/three-particles-editor/commit/cc3f800a1b6f51774a3c6db020a9a0c110dab9f2))
- add copy to clipboard functionality to header component ([9c63f1f](https://github.com/NewKrok/three-particles-editor/commit/9c63f1f8a4fe6ecc524c5a93f4088073fbf9e40c))
- add favicon and web manifest ([2e38880](https://github.com/NewKrok/three-particles-editor/commit/2e388806460786ef1b71ef5a57c4f320eb3aa602))
- add localStorage saving to save dialog with recently saved configs ([3a23a5e](https://github.com/NewKrok/three-particles-editor/commit/3a23a5e938826ea873e13d766a17891afde7e4f7))
- add logo and responsive mobile header ([6e2e92b](https://github.com/NewKrok/three-particles-editor/commit/6e2e92bcf0b349e42798017a5d3c592500a4aeea))
- add snackbar notification when particle system is loaded ([5a79d3c](https://github.com/NewKrok/three-particles-editor/commit/5a79d3c6bde91c76153446907f10a7979adbb335))
- add success-styled snackbar notifications for system actions ([2062924](https://github.com/NewKrok/three-particles-editor/commit/206292407fe476444b4707637024ea97bc6b8d9a))
- convert world.js to TypeScript and update version to 2.0.0 ([1dbdd94](https://github.com/NewKrok/three-particles-editor/commit/1dbdd948ad21257e7e1dc47bcd8856b1c55b9716))
- enhance save functionality with JSON dialog and syntax highlighting ([c3bacc9](https://github.com/NewKrok/three-particles-editor/commit/c3bacc9ebcbf5ced5ee29f3c7731219abb398c02))
- implement configuration version detection and testing infrastructure ([87d51e3](https://github.com/NewKrok/three-particles-editor/commit/87d51e303c6dbf77264dd9eca3be2b3ef22ac80f))
- implement dynamic version and build date in About modal ([748e435](https://github.com/NewKrok/three-particles-editor/commit/748e435c478e0549d81c30d228bcc4fac474b249))
- implement legacy configuration detection modal ([352f873](https://github.com/NewKrok/three-particles-editor/commit/352f873f4026e178f7a962c896cf4019229cd359))
- new movement simulation type was added ([9633a3e](https://github.com/NewKrok/three-particles-editor/commit/9633a3e86dbc3ffe25d74f0d5666b8ec2cd0b74f))
- save theme preference to localStorage ([abc2c34](https://github.com/NewKrok/three-particles-editor/commit/abc2c341287beabd6f86987334e5a4bd76028b06))

# Changelog

All notable changes to the Three Particles Editor will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.1.0] - 2025-04-24

### Fixed

- Fixed SMUI theme CSS generation during build process
- Ensured CSS files are properly included in FTP deployments

### Changed

- Updated build script to include SMUI theme compilation steps

## [2.0.2] - 2025-04-23

### Added

- Added GitHub Actions workflow for FTP deployment
- Added ESLint and Prettier configuration
- Added Husky and lint-staged for pre-commit checks

### Changed

- Replaced node-sass with the modern sass package
- Updated development dependencies to latest compatible versions
- Updated README.md with improved documentation

### Fixed

- Fixed compatibility issues with @newkrok/three-particles v2.0.3
- Addressed warnings about multiple instances of Three.js being imported

## [2.0.0] - 2025-04-20

### Added

- Initial support for @newkrok/three-particles v2.0.x
- TypeScript conversion for improved type safety
- Conversion functionality for legacy configurations

### Changed

- Major API changes to support new parameter types
- Updated default values to match the new library version
- Improved editor UI and user experience

[2.1.0]: https://github.com/NewKrok/three-particles-editor/compare/v2.0.2...v2.1.0
[2.0.2]: https://github.com/NewKrok/three-particles-editor/compare/v2.0.0...v2.0.2
[2.0.0]: https://github.com/NewKrok/three-particles-editor/releases/tag/v2.0.0
