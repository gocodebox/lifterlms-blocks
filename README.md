LifterLMS Blocks
================

[![CircleCI](https://circleci.com/gh/gocodebox/lifterlms-blocks.svg?style=svg)](https://circleci.com/gh/gocodebox/lifterlms-blocks)
[![Maintainability](https://api.codeclimate.com/v1/badges/49df50fa2a04ab1f8e55/maintainability)](https://codeclimate.com/github/gocodebox/lifterlms-blocks/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/49df50fa2a04ab1f8e55/test_coverage)](https://codeclimate.com/github/gocodebox/lifterlms-blocks/test_coverage)

WordPress Editor (Gutenberg) blocks for LifterLMS.

---

## Installing

**Via LifterLMS**

+ Since LifterLMS 3.25.0-alpha.1 this plugin is automatically included in the LifterLMS core codebase

**Installation of the plugin via Zip file**

+ Download the zip file using the "Clone or download" button
+ On your WordPress admin panel navigate to Plugins -> Add New
+ Upload the zip file
+ Activate the plugin


## Building

1. Update changelog: `llms-dev log:write`
2. Update versions: `llms-dev ver:update`
3. Build assets and remove dev files: `npm run build`
4. Build dist archive: `llms-dev archive`
