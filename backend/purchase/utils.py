from django.core.paginator import EmptyPage, PageNotAnInteger, Paginator


def paginateObjects(request, objects, results, pageName):
    page = request.GET.get(pageName or 1)
    paginator = Paginator(objects, results)
    try:
        objects = paginator.page(page)
    except PageNotAnInteger:
        objects = paginator.page(1)
    except EmptyPage:
        objects = paginator.page(paginator.num_pages)
    return objects, paginator
