LifterLMS Blocks Changelog
==========================

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
