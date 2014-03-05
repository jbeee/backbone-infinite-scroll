<?php

///sleep(3);

header("content-type: application/json");

$countOnPage = 40;
$page = 0;
$count = 100;

if (array_key_exists("page", $_GET)) {
    $page = $_GET["page"];
}

echo "[" . PHP_EOL;

$arr = array("Um,", "is", "this", "the", "boring,", "peaceful", "kind", "of", "taking", "to", "the", "streets?", "Guards!", "Bring", "me", "the", "forms", "I", "need", "to", "fill", "out", "to", "have", "her", "taken", "away!", "Ah,", "the", "'Breakfast", "Club'", "soundtrack!", "I", "can't", "wait", "til", "I'm", "old", "enough", "to", "feel", "ways", "about", "stuff!", "Good", "news,", "everyone!", "There's", "a", "report", "on", "TV", "with", "some", "very", "bad", "news!", "Okay,", "it's", "500", "dollars,", "you", "have", "no", "choice", "of", "carrier,", "the", "battery", "can't", "hold", "the", "charge", "and", "the", "reception", "isn't", "very…", "My", "fellow", "Earthicans,", "as", "I", "have", "explained", "in", "my", "book", "Earth", "in", "the", "Balance,", "and", "the", "much", "more", "popular", "''Harry", "Potter", "and", "the", "Balance", "of", "Earth',", "we", "need", "to", "defend", "our", "planet", "against", "pollution.", "Also", "dark", "wizards");

for ($i = 0; $i < $countOnPage; $i++) {
    shuffle($arr);
    $title = implode(" ", array_slice($arr, 0, rand(3, 7)));
    shuffle($arr);
    $desc = implode(" ", array_slice($arr, 0, rand(5, 24)));

    echo "{" . PHP_EOL;
    echo "\"id\":\"" . (($page * $countOnPage) + $i) . "\"," . PHP_EOL;
    echo "\"title\":\"" . $title . "\"," . PHP_EOL;
    echo "\"desc\":\"" . $desc . "\"" . PHP_EOL;
    echo "}";
    if ($i == $countOnPage - 1 || (($page * $countOnPage) + $i) == $count - 1) {
        echo PHP_EOL;
        break;
    } else {
        echo ",";
    }
}

echo "]" . PHP_EOL;

?>