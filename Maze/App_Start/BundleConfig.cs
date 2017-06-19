using System.Web.Optimization;

namespace Maze
{
    public class BundleConfig
    {
        // For more information on bundling, visit https://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles( BundleCollection bundles )
        {
            bundles.Add( new ScriptBundle( "~/bundles/site-js-resources" ).Include(
                        "~/Scripts/Libs/jquery-{version}.js",
                        "~/Scripts/Libs/jquery.mobile-events.js",
                        "~/Scripts/Libs/velocity.min.js",
                        "~/Scripts/Libs/bootstrap.js",
                        "~/Scripts/Libs/respond.js",
                        "~/Scripts/Js/App.js" ) );

            bundles.Add( new ScriptBundle( "~/bundles/jqueryval" ).Include(
                        "~/Scripts/Libs/jquery.validate*" ) );

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at https://modernizr.com to pick only the tests you need.
            bundles.Add( new ScriptBundle( "~/bundles/modernizr" ).Include(
                        "~/Scripts/Libs/modernizr-*" ) );

            bundles.Add( new StyleBundle( "~/Styles/css" ).Include(
                      "~/Styles/css/bootstrap.css",
                      "~/Styles/css/site.css" ) );
        }
    }
}
