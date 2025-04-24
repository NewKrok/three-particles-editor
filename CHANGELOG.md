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
