from django.core.paginator import EmptyPage, PageNotAnInteger, Paginator


def paginateObjects(request, objects, results, pageName):
    page = request.GET.get(pageName or 1)
    # print(request.GET.urlencode())
    paginator = Paginator(objects, results)
    # paginate the events
    try:
        objects = paginator.page(page)
    except PageNotAnInteger:
        objects = paginator.page(1)
    except EmptyPage:
        objects = paginator.page(paginator.num_pages)
    span = 5
    leftIndex = int(page or 0) - span
    if leftIndex < 1:
        leftIndex = 1
    rightIndex = int(page or 0) + span + 2
    if rightIndex > paginator.num_pages:
        rightIndex = paginator.num_pages + 1
    custom_range = range(leftIndex, rightIndex)
    # list(paginator.get_elided_page_range(8, on_each_side=1))

    return custom_range, objects
