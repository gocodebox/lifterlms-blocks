LifterLMS Blocks Changelog
==========================

v1.5.0 - 2019-05-16
-------------------

+ All blocks are now registered only for post types where they can actually be used.


v1.4.1 - 2019-05-13
-------------------

+ Fixed double slashes in asset path of CSS and JS files, thanks [@pondermatic](https://github.com/pondermatic)!


v1.4.0 - 2019-04-26
-------------------

+ Added an "unmigration" utility to LifterLMS -> Status -> Tools & Utilities which can be used to remove LifterLMS blocks from courses and lessons which were migrated to the block editor structure. This tool is only available when the Classic Editor plugin is installed and enabled and it will remove blocks from ALL courses and lessons regardless of whether or not the block editor is being utilized on that post.


v1.3.8 - 2019-03-19
-------------------

+ Explicitly import jQuery when used within blocks.


v1.3.7 - 2019-02-27
-------------------

+ Fixed an issue preventing "Pricing Table" blocks from displaying on the admin panel when the current user was enrolled in the course or no payment gateways were enabled on the site.


v1.3.6 - 2019-02-22
-------------------

+ Updated the editor icons to use the new LifterLMS Icon
+ Change method for Pricing Table block re-rendering to prevent an issue resulting it always appearing that the post has unsaved data.


v1.3.5 - 2019-02-21
-------------------

+ Automatically re-renders Pricing Table blocks when access plans are saved or deleted via the course / membership access plan metabox.


v1.3.4 - 2019-01-30
-------------------

+ Add support for the Divi Builder's "Classic Editor" mode
+ Skip post migration when "Classic" mode is enabled


v1.3.3 - 2019-01-23
-------------------

+ Add conditions to check for Classic Editor settings configured to enforce classic/block for all posts.


v1.3.2 - 2019-01-16
-------------------

+ Fix issue preventing template actions from being removed from migrated courses & lessons.


v1.3.1 - 2019-01-15
-------------------

+ Move post migration checks to a callable function `llms_blocks_is_post_migrated()`


v1.3.0 - 2019-01-09
-------------------

+ Add course and membership catalog visibility settings into the block editor.
+ Fixed issue preventing the course instructors metabox from displaying when using the classic editor plugin.

v1.2.0 - 2018-12-27
-------------------

+ Add conditional support for page builders: Beaver Builder, Divi Builder, and Elementor.
+ Fixed issue causing LifterLMS core sales pages from outputting automatic content (like pricing tables) on migrated posts.


v1.1.2 - 2018-12-17
-------------------

+ Add a filter to the migration check on lessons & courses.


v1.1.1 - 2018-12-14
-------------------

+ Fix issue causing LifterLMS Core Actions to be removed when using the Classic Editor plugin.


v1.1.0 - 2018-12-12
-------------------

+ Editor blocks now display a lock icon when hovering/selecting a block which corresponds to the enrollment visibility settings of the block.
+ Removal of core actions is now handled by a general migrator function instead of by individual blocks.
+ Fix issue causing block visibility options to not be properly set when enrollment visibility is first enabled for a block.


v1.0.1 - 2018-12-05
-------------------

+ Made plugin url relative


v1.0.0 - 2018-12-05
-------------------

+ Initial public release
