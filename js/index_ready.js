/* index.html document ready */
var clothes_db = {}; // prevention of duplication

function settingClothesDatas() {
    $("#clothes_db_table>tbody").empty();

    $.each(clothes_db, function (key, value) {
        var clothes_color = value.split('_');
        var clothes = clothes_color[0];
        var color = clothes_color[1];

        var tagContent =
            '<tr onclick="getClothes(this);">' +
                '<td><input class="form-check-input" type="checkbox" name="check_list"></td>' +
                '<td>' + clothes +'</td>' +
                '<td class="d-flex justify-content-center">' +
                    '<div class="sample-color align-self-center" style="background-color:' + color + ';"></div>' +
                    ' &nbsp; ' +
                    color +
                '</td>' +
            '</tr>';

        $("#clothes_db_table>tbody").append(tagContent);
    });

    if($("#clothes_db_table>tbody tr").length > 0) {
        $("#clothes_db_table").show();
        $("#comb_button").show();
        $("#delete_button").show();
    } else {
        $("#clothes_db_table").hide();
        $("#comb_button").hide();
        $("#delete_button").hide();
    }

    $("#selected_clothes_num").text(0);
    $("#total_clothes_num").text(Object.keys(clothes_db).length);
    $("#all_check").prop("checked", false);

    // check_list
    $("input:checkbox[name=check_list]").click(function() {
        $("#selected_clothes_num").text($("input:checkbox[name=check_list]:checked").length);
        if($("input:checkbox[name=check_list]:checked").length == Object.keys(clothes_db).length) {
            $("#all_check").prop("checked", true);
        } else {
            $("#all_check").prop("checked", false);
        }
    });
}

function addClothesData(clothes_color) {
    var check = true;
    
    $("#clothes_db_table>tbody tr").each(function() {
        var tr = $(this);
        var td = tr.children();

        var tmp_clothes = td.eq(1).text();
        var tmp_color = td.eq(2).text();
        var tmp_clothes_color = tmp_clothes + "_" + tmp_color;
    
        if(tmp_clothes_color == clothes_color) {
            check = false;
            return false;
        }
    });

    if(check) {
        clothes_color = clothes_color.split('_');
        var clothes = clothes_color[0];
        var color = clothes_color[1];

        var tagContent =
            '<tr onclick="getClothes(this);">' +
                '<td><input class="form-check-input" type="checkbox" name="check_list"></td>' +
                '<td>' + clothes +'</td>' +
                '<td class="d-flex justify-content-center">' +
                    '<div class="sample-color align-self-center" style="background-color:' + color + ';"></div>' +
                    ' &nbsp; ' +
                    color +
                '</td>' +
            '</tr>';

        $("#clothes_db_table>tbody").append(tagContent);

        if($("#clothes_db_table>tbody tr").length > 0) {
            $("#clothes_db_table").show();
            $("#comb_button").show();
            $("#delete_button").show();
        } else {
            $("#clothes_db_table").hide();
            $("#comb_button").hide();
            $("#delete_button").hide();
        }

        $("#total_clothes_num").text(Object.keys(clothes_db).length);
        $("#all_check").prop("checked", false);

        // check_list
        $("input:checkbox[name=check_list]").click(function() {
            $("#selected_clothes_num").text($("input:checkbox[name=check_list]:checked").length);
            if($("input:checkbox[name=check_list]:checked").length == Object.keys(clothes_db).length) {
                $("#all_check").prop("checked", true);
            } else {
                $("#all_check").prop("checked", false);
            }
        });
    }
}

$(document).ready(function () {
    for(var i=0, len=localStorage.length; i<len; i++) {
        var key = localStorage.key(i);
        var value = localStorage.getItem(localStorage.key(i));

        if(key == value) clothes_db[localStorage.key(i)] = localStorage.getItem(localStorage.key(i));
    }
    settingClothesDatas();


    // color_picker
    $("#top_color_picker").change(function() {
        $("#top_clothes").css("background-color", $("#top_color_picker").val());
        $("#select_top_color").val("color").prop("selected", true);
    });
    $("#bottom_color_picker").change(function() {
        $("#bottom_clothes").css("background-color", $("#bottom_color_picker").val());
        $("#select_bottom_color").val("color").prop("selected", true);
    });

    // add_color_picker
    $("#add_top_color_picker").change(function() {
        $("#top_clothes").css("background-color", $("#add_top_color_picker").val());
    });
    $("#add_bottom_color_picker").change(function() {
        $("#bottom_clothes").css("background-color", $("#add_bottom_color_picker").val());
    });


    // add_button
    $("#add_button").click(function() {
        var topType = $("#add_select_top_type").val();
        var bottomType = $("#add_select_bottom_type").val();

        if(topType != "default") {
            var item = topType + "_" + $("#add_top_color_picker").val();

            localStorage.setItem(item, item);
            clothes_db[item] = item;

            addClothesData(item);
        }
        if(bottomType != "default") {
            var item = bottomType + "_" + $("#add_bottom_color_picker").val();

            localStorage.setItem(item, item);
            clothes_db[item] = item;

            addClothesData(item);
        }
    });


    // all_check
    $("#all_check").click(function() {
        var checked = $("#all_check").is(":checked");
		if(checked) {
            $("input:checkbox").prop("checked", true);
            $("#selected_clothes_num").text($("input:checkbox[name=check_list]:checked").length);
        }
        else {
            $("input:checkbox").prop("checked", false);
            $("#selected_clothes_num").text($("input:checkbox[name=check_list]:checked").length);
        }
	});

    // comb_button
    $("#comb_button").click(function() {
        var checkedList = $("input:checkbox[name=check_list]:checked");

        var tops = [];
        var bottoms = [];

        checkedList.each(function(item) {
            var tr = checkedList.parent().parent().eq(item);
            var td = tr.children();

            var clothes = td.eq(1).text();
            var color = td.eq(2).text();
            var clothes_color = clothes + "_" + color;

            if(typeParser(clothes) == "top") tops.push(clothes_color);
            else if(typeParser(clothes) == "bottom") bottoms.push(clothes_color);
        });

        if(tops.length != 0 && bottoms.length != 0) {
            var top_bottom = clothesRandomComb(tops, bottoms);
            top_clothes = top_bottom[0];
            bottom_clothes = top_bottom[1];
            setTopAndBottom(top_clothes, bottom_clothes);
        } else {
            $("#alert_comb").show();
            setTimeout(function() { $("#alert_comb").hide(); }, 2000);
        }
    });

    // real_delete_button
    $("#real_delete_button").click(function() {
        var checkedList = $("input:checkbox[name=check_list]:checked");

        checkedList.each(function(item) {
            var tr = checkedList.parent().parent().eq(item);
            var td = tr.children();

            var clothes = td.eq(1).text();
            var color = td.eq(2).text();
            var clothes_color = clothes + "_" + color;

            localStorage.removeItem(clothes_color);
            delete clothes_db[clothes_color];
        });

        settingClothesDatas();
    });
});