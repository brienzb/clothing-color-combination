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
                '<td>' + color + '</td>' +
            '</tr>';

        $("#clothes_db_table>tbody").append(tagContent);
    });

    if($("#clothes_db_table>tbody tr").length > 0) {
        $("#clothes_db_table").show();
        $("#comb_button").show();
        $("#delete_button").show();
    }

    $("#selected_clothes_num").text(0);
    $("#total_clothes_num").text(Object.keys(clothes_db).length);

    // check_list
    $("input:checkbox[name=check_list]").click(function() {
        $("#selected_clothes_num").text($("input:checkbox[name=check_list]:checked").length);
    });
}

$(document).ready(function () {
    for(var i=0, len=localStorage.length; i<len; i++) {
        clothes_db[localStorage.key(i)] = localStorage.getItem(localStorage.key(i));
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
            clothes_db[item] = localStorage.getItem(item);
        }
        if(bottomType != "default") {
            var item = bottomType + "_" + $("#add_bottom_color_picker").val();
            localStorage.setItem(item, item);
            clothes_db[item] = localStorage.getItem(item);
        }

        settingClothesDatas();
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
});