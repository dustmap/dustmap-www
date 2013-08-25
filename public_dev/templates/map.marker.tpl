
<div class="marker">
    <h3>Node "<%= name %>"</h3>
    <h4><%= (new Date(last_upload.ts)).toString() %></h4>

    <table>
        <% last_upload.measurements.forEach(function(m){ %>
            <tr>
                <td><%= m.type %></td>
                <td><%= m.value %></td>
            </tr>
        <% }); %>
    </table>

    <a href="#/<%= id %>/showOlder">show older</a>
</div>

