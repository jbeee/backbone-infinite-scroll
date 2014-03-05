<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
        <link rel="stylesheet" type="text/css" href="css/style.css"/>

        <!-- requirements -->
        <script language="javascript" type="text/javascript" src="../js/requirements/jquery.js"></script>
        <script language="javascript" type="text/javascript" src="../js/requirements/underscore-min.js"></script>
        <script language="javascript" type="text/javascript" src="../js/requirements/backbone-min.js"></script>

        <!-- model -->
        <script language="javascript" type="text/javascript" src="../js/release/scroll-model.js"></script>

        <!-- views -->
        <script language="javascript" type="text/javascript" src="../js/release/scroll-view.js"></script>        
    </head>

    <body>
        <div class="header">
            <div class='titles'>
                <h1>Backbone Infinite Scroll - DEMO SITE</h1>
            </div>
            <div class='btn-download'><a href="https://github.com/dizzyn/backbone-infinite-scroll"><button>Download Library from GitHub</button></a></div>
        </div>

        <?php

        $script = strtok($_SERVER["REQUEST_URI"], "?");
        ?>

        <div class="menu">
            <ul>
                <li class="<?php echo ($script === "/" ? "active" : "") ?>"><a href="/">Basic demo</a></li>
                <li class="<?php echo ($script === "/static-data" ? "active" : "") ?>"><a href="/static-data">Offline data</a></li>
                <li class="<?php echo ($script === "/manual-loading" ? "active" : "") ?>"><a href="/manual-loading">Manual loading</a></li>
                <li class="<?php echo ($script === "/alternative-layout" ? "active" : "") ?>"><a href="/alternative-layout">Alternative layout</a></li>
                <!-- li><a href="/16columns">16 columns</a></li -->
                <!-- li><a href="/ads-inside">Ads inside</a></li>
                <li><a href="/big-pod">Big first pod</a></li -->
                <!-- li><a href="/responsive">Responsive</a></li -->
            </ul>
        </div>

        <div class="inner">

            <?php
            switch ($script) {
                case "/16columns":
                    include "./demos/16columns.phtml";
                    break;
                case "/static-data":
                    include "./demos/_static-data.phtml";
                    break;
                case "/manual-loading":
                    include "./demos/_manual-loading.phtml";
                    break;
                case "/alternative-layout":
                    include "./demos/_alternative-layout.phtml";
                    break;
                case "/adds-inside":
                    include "./demos/16columns.phtml";
                    break;
                case "/responsive":
                    include "./demos/responsive.phtml";
                    break;
                default:
                    include "./demos/_basic.phtml";
            }
            ?>

        </div>

    </body>
</html>
